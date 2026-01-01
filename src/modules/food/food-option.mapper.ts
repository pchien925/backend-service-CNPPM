import { OptionMapper } from '../option/option.mapper';
import { CreateFoodOptionDto } from './dtos/create-food-optiondto';
import { FoodOptionDto } from './dtos/food-option.dto';
import { UpdateFoodOptionDto } from './dtos/update-food-optiondto';
import { FoodOption } from './entities/food-option.entity';

export class FoodOptionMapper {
  static toEntityFromCreate(dto: CreateFoodOptionDto): FoodOption {
    const entity = new FoodOption();
    entity.ordering = dto.ordering ?? 0;
    entity.requirementType = dto.requirementType ?? 1;
    entity.maxSelect = dto.maxSelect ?? 1;
    return entity;
  }

  static toEntityFromUpdate(entity: FoodOption, dto: UpdateFoodOptionDto): FoodOption {
    if (dto.ordering !== undefined) entity.ordering = dto.ordering;
    if (dto.requirementType !== undefined) entity.requirementType = dto.requirementType;
    if (dto.maxSelect !== undefined) entity.maxSelect = dto.maxSelect;
    return entity;
  }
  static toResponse(entity: FoodOption): FoodOptionDto {
    if (!entity) return null;
    return {
      id: entity.id,
      ordering: entity.ordering,
      requirementType: entity.requirementType,
      maxSelect: entity.maxSelect,
      option: OptionMapper.toResponse(entity.option),
    };
  }

  static toResponseList(entities: FoodOption[]): FoodOptionDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
