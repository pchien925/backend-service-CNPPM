import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { NotFoundException } from 'src/exception/not-found.exception';
import { Food } from 'src/modules/food/entities/food.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { ComboGroupItemMapper } from './combo-group-item.mapper';
import { ComboGroupMapper } from './combo-group.mapper';
import { ComboGroupDto } from './dtos/combo-group.dto';
import { ComboGroupQueryDto } from './dtos/combo-group.query.dto';
import { CreateComboGroupDto } from './dtos/create-combo-group.dto';
import { UpdateComboGroupDto } from './dtos/update-combo-group.dto';
import { ComboGroupItem } from './entities/combo-group-item.entity';
import { ComboGroup } from './entities/combo-group.entity';
import { Combo } from './entities/combo.entity';
import { ComboGroupSpecification } from './specification/combo-group.specification';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@Injectable()
export class ComboGroupService {
  constructor(
    @InjectRepository(Combo) private readonly comboRepo: Repository<Combo>,
    @InjectRepository(ComboGroup) private readonly comboGroupRepo: Repository<ComboGroup>,
    @InjectRepository(ComboGroupItem)
    private readonly comboGroupItemRepo: Repository<ComboGroupItem>,
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,

    private readonly dataSource: DataSource,
  ) {}

  private async validateFoodItems(foodIds: string[]): Promise<Map<string, Food>> {
    const uniqueFoodIds = [...new Set(foodIds)];
    if (uniqueFoodIds.length === 0) return new Map();

    const foods = await this.foodRepo.findBy({ id: In(uniqueFoodIds), status: STATUS_ACTIVE });
    if (foods.length !== uniqueFoodIds.length) {
      throw new NotFoundException(
        `One or more Food items not found or inactive.`,
        ErrorCode.FOOD_ERROR_NOT_FOUND,
      );
    }
    return new Map(foods.map(f => [f.id, f]));
  }

  async create(dto: CreateComboGroupDto): Promise<void> {
    const { comboId, items } = dto;

    const combo = await this.comboRepo.findOneBy({ id: comboId, status: Not(STATUS_DELETE) });
    if (!combo) {
      throw new NotFoundException(`Combo not found.`, ErrorCode.COMBO_ERROR_NOT_FOUND);
    }

    const foodMap = await this.validateFoodItems(items.map(i => i.foodId));

    await this.dataSource.transaction(async manager => {
      const comboGroupEntity = ComboGroupMapper.toEntityFromCreate(dto);
      comboGroupEntity.combo = combo;
      const savedGroup = await manager.save(comboGroupEntity);

      const newItems = items.map(itemDto => {
        const itemEntity = ComboGroupItemMapper.toEntityFromCreate(itemDto);
        itemEntity.comboGroup = savedGroup;
        const foodValue = foodMap.get(itemDto.foodId);
        itemEntity.food = foodValue;
        return itemEntity;
      });
      await manager.save(newItems);
    });
  }

  async findAll(query: ComboGroupQueryDto): Promise<ResponseListDto<ComboGroupDto[]>> {
    const { page = 0, limit = 1000 } = query;
    const filterSpec = new ComboGroupSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.comboGroupRepo.findAndCount({
      where,
      relations: [
        'combo',
        'items',
        'items.food',
        'items.food.category',
        'items.food.foodTags.tag',
        'items.food.foodOptions.option',
        'items.food.foodOptions.option.values',
      ],
      order: { ordering: 'ASC', id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = ComboGroupMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<ComboGroupDto> {
    const group = await this.comboGroupRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: [
        'combo',
        'items',
        'items.food',
        'items.food.category',
        'items.food.foodTags.tag',
        'items.food.foodOptions.option',
        'items.food.foodOptions.option.values',
      ],
    });
    if (!group) {
      throw new NotFoundException(`Combo Group not found.`, ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND);
    }
    return ComboGroupMapper.toResponse(group);
  }

  async update(dto: UpdateComboGroupDto): Promise<void> {
    const { id: groupId, comboId, updateItems, newItems } = dto;

    const groupEntity = await this.comboGroupRepo.findOne({
      where: { id: groupId, combo: { id: comboId }, status: Not(STATUS_DELETE) },
      relations: ['items'],
    });

    if (!groupEntity) {
      throw new NotFoundException(
        `Combo Group not found or does not belong to the Combo.`,
        ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND,
      );
    }

    await this.dataSource.transaction(async manager => {
      const comboGroupRepo = manager.getRepository(ComboGroup);
      const comboGroupItemRepo = manager.getRepository(ComboGroupItem);

      const partialUpdate = ComboGroupMapper.toEntityPartialFromUpdate(dto);
      await comboGroupRepo.update({ id: groupId }, partialUpdate);

      const currentItemIdsInRequest = new Set<string>();
      if (updateItems && updateItems.length > 0) {
        const foodIdsToCheck = updateItems.filter(i => i.foodId !== undefined).map(i => i.foodId!);
        if (foodIdsToCheck.length > 0) {
          await this.validateFoodItems(foodIdsToCheck);
        }

        for (const itemDto of updateItems) {
          currentItemIdsInRequest.add(itemDto.id);
          const updateData: Partial<ComboGroupItem> = {
            extraPrice: itemDto.extraPrice,
            ordering: itemDto.ordering,
            status: itemDto.status,
            food: itemDto.foodId !== undefined ? ({ id: itemDto.foodId } as Food) : undefined,
          };

          Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key],
          );

          await comboGroupItemRepo.update(
            { id: itemDto.id, comboGroup: { id: groupId } },
            updateData,
          );
        }
      }

      const itemsToSoftDelete = groupEntity.items
        .filter(item => item.status !== STATUS_DELETE)
        .filter(item => !currentItemIdsInRequest.has(item.id))
        .map(item => item.id);

      //xóa mềm
      if (itemsToSoftDelete.length > 0) {
        await comboGroupItemRepo.update({ id: In(itemsToSoftDelete) }, { status: STATUS_DELETE });
      }

      if (newItems && newItems.length > 0) {
        const foodMap = await this.validateFoodItems(newItems.map(i => i.foodId));
        const newGroupItems = newItems.map(itemDto => {
          const itemEntity = ComboGroupItemMapper.toEntityFromCreate(itemDto);
          itemEntity.comboGroup = groupEntity;
          itemEntity.food = foodMap.get(itemDto.foodId)!;
          return itemEntity;
        });
        await manager.save(newGroupItems);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const groupToDelete = await this.comboGroupRepo.findOneBy({ id, status: Not(STATUS_DELETE) });
    if (!groupToDelete) {
      throw new NotFoundException(`Combo Group not found.`, ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND);
    }

    await this.dataSource.transaction(async manager => {
      await manager
        .getRepository(ComboGroupItem)
        .update({ comboGroup: { id } }, { status: STATUS_DELETE });

      await manager.getRepository(ComboGroup).update({ id }, { status: STATUS_DELETE });
    });
  }
}
