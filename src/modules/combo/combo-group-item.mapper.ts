import { FoodMapper } from '../food/food.mapper';
import { ComboGroupItemDto } from './dtos/combo-group-item.dto';
import { CreateComboGroupItemDto } from './dtos/create-combo-group-item.dto';
import { ComboGroupItem } from './entities/combo-group-item.entity';

export class ComboGroupItemMapper {
  static toEntityFromCreate(dto: CreateComboGroupItemDto): ComboGroupItem {
    const entity = new ComboGroupItem();
    entity.extraPrice = dto.extraPrice ?? 0;
    entity.ordering = dto.ordering ?? 0;
    return entity;
  }

  static toResponse(entity: ComboGroupItem): ComboGroupItemDto {
    return {
      id: entity.id,
      extraPrice: entity.extraPrice,
      ordering: entity.ordering,
      food: entity.food ? FoodMapper.toResponse(entity.food) : null,
    };
  }
}
