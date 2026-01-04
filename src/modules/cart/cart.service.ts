import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { UserContextHelper } from 'src/shared/context/user-context.helper';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { ComboGroupItem } from '../combo/entities/combo-group-item.entity';
import { Combo } from '../combo/entities/combo.entity';
import { FoodOption } from '../food/entities/food-option.entity';
import { Food } from '../food/entities/food.entity';
import { OptionValue } from '../option/entities/option-value.entity';
import { CartMapper } from './cart.mapper';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';
import { CartItemComboSelection } from './entities/cart-item-combo-selection.entity';
import { CartItemOption } from './entities/cart-item-option.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { ITEM_KIND_COMBO, ITEM_KIND_FOOD } from 'src/constants/app.constant';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Food) private foodRepo: Repository<Food>,
    @InjectRepository(Combo) private comboRepo: Repository<Combo>,
    @InjectRepository(OptionValue) private optionValueRepo: Repository<OptionValue>,
    private dataSource: DataSource,
  ) {}

  async getMyCart() {
    const userId = UserContextHelper.getId();
    let cart = await this.cartRepo.findOne({ where: { account: { id: userId } } });

    if (!cart) {
      cart = await this.cartRepo.save(
        this.cartRepo.create({ account: { id: userId }, totalPrice: 0 }),
      );
    }

    const items = await this.itemRepo.find({
      where: { cart: { id: cart.id } },
      relations: [
        'options',
        'options.optionValue',
        'comboSelections',
        'comboSelections.selectedFood',
      ],
    });

    return CartMapper.toResponse(cart, items);
  }

  async addToCart(dto: AddToCartDto) {
    const userId = UserContextHelper.getId();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let cart = await queryRunner.manager.findOne(Cart, { where: { account: { id: userId } } });
      if (!cart) {
        cart = await queryRunner.manager.save(Cart, { account: { id: userId }, totalPrice: 0 });
      }

      const existingItems = await queryRunner.manager.find(CartItem, {
        where: {
          cart: { id: cart.id },
          itemId: dto.itemId,
          itemKind: dto.itemKind,
        },
        relations: [
          'options',
          'options.optionValue',
          'comboSelections',
          'comboSelections.selectedFood',
        ],
      });

      let itemToUpdate: CartItem | null = null;
      for (const item of existingItems) {
        if (dto.itemKind === ITEM_KIND_FOOD) {
          //1
          const dbOptionIds = item.options?.map(o => o.optionValue?.id);
          if (this.compareIds(dbOptionIds, dto.optionIds)) {
            itemToUpdate = item;
            break;
          }
        } else if (dto.itemKind === ITEM_KIND_COMBO) {
          //2
          const dbSelectionIds = item.comboSelections?.map(s => s.selectedFood?.id);
          if (this.compareIds(dbSelectionIds, dto.comboSelectionFoodIds)) {
            itemToUpdate = item;
            break;
          }
        }
      }

      if (itemToUpdate) {
        itemToUpdate.quantity += dto.quantity;
        await queryRunner.manager.save(itemToUpdate);
      } else {
        let basePrice = 0;
        if (dto.itemKind === ITEM_KIND_FOOD) {
          const food = await queryRunner.manager.findOneBy(Food, { id: dto.itemId });
          if (!food) throw new NotFoundException('Food not found', ErrorCode.FOOD_ERROR_NOT_FOUND);
          basePrice = Number(food.basePrice);

          await this.validateFoodOptionsOrThrow(dto.itemId, dto.optionIds, queryRunner.manager);
        } else {
          const combo = await queryRunner.manager.findOneBy(Combo, { id: dto.itemId });
          if (!combo)
            throw new NotFoundException('Combo not found', ErrorCode.COMBO_ERROR_NOT_FOUND);
          basePrice = Number(combo.basePrice);

          await this.validateComboSelectionsOrThrow(
            dto.itemId,
            dto.comboSelectionFoodIds,
            queryRunner.manager,
          );
        }

        const cartItem = queryRunner.manager.create(CartItem, {
          cart,
          itemKind: dto.itemKind,
          itemId: dto.itemId,
          quantity: dto.quantity,
          basePrice,
          note: dto.note,
        });
        const savedItem = await queryRunner.manager.save(cartItem);

        if (dto.itemKind === ITEM_KIND_FOOD && dto.optionIds?.length) {
          const options = await queryRunner.manager.findBy(OptionValue, { id: In(dto.optionIds) });
          const itemOptions = options.map(opt =>
            queryRunner.manager.create(CartItemOption, {
              cartItem: savedItem,
              optionValue: opt,
              extraPrice: Number(opt.extraPrice),
            }),
          );
          await queryRunner.manager.save(itemOptions);
        }

        if (dto.itemKind === ITEM_KIND_COMBO && dto.comboSelectionFoodIds?.length) {
          const groupItems = await queryRunner.manager.find(ComboGroupItem, {
            where: {
              food: { id: In(dto.comboSelectionFoodIds) },
              comboGroup: { combo: { id: dto.itemId } },
            },
          });

          const comboSelections = dto.comboSelectionFoodIds.map(foodId => {
            const gItem = groupItems.find(gi => gi.food.id === foodId);
            return queryRunner.manager.create(CartItemComboSelection, {
              cartItem: savedItem,
              selectedFood: { id: foodId } as Food,
              extraPrice: gItem ? Number(gItem.extraPrice) : 0,
            });
          });
          await queryRunner.manager.save(comboSelections);
        }
      }

      await this.recalculateCartTotal(cart.id, queryRunner.manager);
      await queryRunner.commitTransaction();

      return this.getMyCart();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateCartItem(dto: UpdateCartItemDto) {
    const cartItem = await this.itemRepo.findOne({
      where: { id: dto.cartItemId },
      relations: ['cart'],
    });

    if (!cartItem)
      throw new NotFoundException('Cart item not found', ErrorCode.CART_ITEM_ERROR_NOT_FOUND);

    if (dto.quantity === 0) {
      await this.itemRepo.remove(cartItem);
    } else {
      cartItem.quantity = dto.quantity;
      if (dto.note !== undefined) cartItem.note = dto.note;
      await this.itemRepo.save(cartItem);
    }

    await this.recalculateCartTotal(cartItem.cart.id);
    return this.getMyCart();
  }

  async deleteCartItem(cartItemId: string) {
    const userId = UserContextHelper.getId();

    const cartItem = await this.itemRepo.findOne({
      where: {
        id: cartItemId,
        cart: { account: { id: userId } },
      },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found', ErrorCode.CART_ITEM_ERROR_NOT_FOUND);
    }

    const cartId = cartItem.cart.id;
    await this.itemRepo.remove(cartItem);

    await this.recalculateCartTotal(cartId);

    return this.getMyCart();
  }

  async clearMyCart() {
    const userId = UserContextHelper.getId();
    const cart = await this.cartRepo.findOne({
      where: { account: { id: userId } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found', ErrorCode.CART_ERROR_NOT_FOUND);
    }

    await this.itemRepo.delete({ cart: { id: cart.id } });

    cart.totalPrice = 0;
    await this.cartRepo.save(cart);

    return this.getMyCart();
  }

  private async recalculateCartTotal(cartId: string, manager = this.dataSource.manager) {
    const items = await manager.find(CartItem, {
      where: { cart: { id: cartId } },
      relations: ['options', 'comboSelections'],
    });

    const total = items.reduce((sum, item) => {
      const optionsPrice =
        item.options?.reduce((optSum, opt) => optSum + Number(opt.extraPrice), 0) || 0;

      const comboExtraPrice =
        item.comboSelections?.reduce((cbSum, cb) => cbSum + Number(cb.extraPrice), 0) || 0;

      const itemTotal = (Number(item.basePrice) + optionsPrice + comboExtraPrice) * item.quantity;

      return sum + itemTotal;
    }, 0);

    await manager.update(Cart, cartId, { totalPrice: total });
  }

  private compareIds(
    dbIds: (string | undefined)[] | undefined,
    dtoIds: string[] | undefined,
  ): boolean {
    const arr1 = (dbIds || []).filter(id => !!id) as string[];
    const arr2 = (dtoIds || []).filter(id => !!id) as string[];

    if (arr1.length !== arr2.length) return false;
    if (arr1.length === 0) return true;

    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();

    return sorted1.every((val, index) => val === sorted2[index]);
  }

  /**
   * Guard: Kiểm tra food có option đó ko
   */
  private async validateFoodOptionsOrThrow(
    foodId: string,
    optionIds: string[],
    manager: EntityManager,
  ): Promise<void> {
    if (!optionIds?.length) return;

    const foodOptions = await manager.find(FoodOption, {
      where: { food: { id: foodId } },
      relations: ['option'],
    });
    const allowedOptionIds = foodOptions.map(fo => fo.option.id);

    const requestedValues = await manager.find(OptionValue, {
      where: { id: In(optionIds) },
      relations: ['option'],
    });

    if (requestedValues.length !== optionIds.length) {
      throw new BadRequestException('Một số tùy chọn không tồn tại.');
    }

    for (const val of requestedValues) {
      if (!val.option || !allowedOptionIds.includes(val.option.id)) {
        throw new BadRequestException(`Tùy chọn '${val.name}' không dành cho món ăn này.`);
      }
    }
  }

  /**
   * Guard: Kiểm tra các món được chọn có nằm trong Combo không
   */
  private async validateComboSelectionsOrThrow(
    comboId: string,
    selectionFoodIds: string[],
    manager: EntityManager,
  ): Promise<void> {
    if (!selectionFoodIds?.length) return;

    const groupItems = await manager.find(ComboGroupItem, {
      where: { comboGroup: { combo: { id: comboId } } },
      relations: ['food'],
    });

    const validFoodIdsInCombo = groupItems.map(gi => gi.food.id);

    for (const fId of selectionFoodIds) {
      if (!validFoodIdsInCombo.includes(fId)) {
        throw new BadRequestException(`Món ăn ID ${fId} không có trong combo này.`);
      }
    }
  }
}
