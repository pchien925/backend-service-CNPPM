import { FoodMapper } from '../food/food.mapper';
import { OptionValueMapper } from '../option/option-value.mapper';
import { CartItemDto } from './dtos/cart-item.dto';
import { CartDto } from './dtos/cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

export class CartMapper {
  static toResponse(cart: Cart, items: CartItem[]): CartDto {
    const dto = new CartDto();
    dto.id = cart.id;
    dto.totalPrice = Number(cart.totalPrice);
    dto.items = items.map(item => this.toItemResponse(item));
    return dto;
  }

  static toItemResponse(item: CartItem): CartItemDto {
    const dto = new CartItemDto();
    dto.id = item.id;
    dto.itemKind = item.itemKind;
    dto.itemId = item.itemId;
    dto.quantity = item.quantity;
    dto.basePrice = Number(item.basePrice);
    dto.note = item.note;

    dto.options =
      item.options?.map(opt => ({
        id: opt.id,
        extraPrice: Number(opt.extraPrice),
        optionValue: OptionValueMapper.toResponse(opt.optionValue),
      })) || [];

    dto.comboSelections =
      item.comboSelections?.map(sel => ({
        id: sel.id,
        extraPrice: Number(sel.extraPrice),
        selectedFood: FoodMapper.toAutoCompleteResponse(sel.selectedFood),
      })) || [];

    return dto;
  }
}
