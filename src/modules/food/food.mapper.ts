import { CategoryMapper } from '../category/category.mapper';
import { OptionValueMapper } from '../option/option-value.mapper';
import { TagMapper } from '../tag/tag.mapper';
import { CreateFoodDto } from './dtos/create-food.dto';
import { FoodOptionDto } from './dtos/food-option.dto';
import { FoodDto } from './dtos/food.dto';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { FoodOption } from './entities/food-option.entity';
import { Food } from './entities/food.entity';

export class FoodMapper {
  static toEntityFromCreate(dto: Partial<CreateFoodDto>): Food {
    const entity = new Food();
    entity.name = dto.name!;
    entity.description = dto.description;
    entity.basePrice = dto.basePrice!;
    entity.imageUrl = dto.imageUrl;
    entity.cookingTime = dto.cookingTime;
    entity.ordering = dto.ordering ?? 0;
    return entity;
  }

  static toEntityFromUpdate(entity: Food, dto: Partial<UpdateFoodDto>): Food {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.basePrice !== undefined) entity.basePrice = dto.basePrice;
    if (dto.imageUrl !== undefined) entity.imageUrl = dto.imageUrl;
    if (dto.cookingTime !== undefined) entity.cookingTime = dto.cookingTime;
    if (dto.ordering !== undefined) entity.ordering = dto.ordering;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toFoodOptionDetailDto(entity: FoodOption): FoodOptionDto {
    const optionEntity = entity.option;

    return {
      id: optionEntity.id,
      name: optionEntity.name,
      ordering: entity.ordering,
      requirementType: entity.requirementType,
      maxSelect: entity.maxSelect,
      optionValues: OptionValueMapper.toResponseList(entity.option.values),
    };
  }

  static toResponse(entity: Food): FoodDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      basePrice: Number(entity.basePrice),
      imageUrl: entity.imageUrl ?? null,
      cookingTime: entity.cookingTime ?? null,
      ordering: entity.ordering,
      status: entity.status,
      category: CategoryMapper.toResponse(entity.category),
      tags: entity.foodTags?.length
        ? entity.foodTags.map(ft => TagMapper.toResponse(ft.tag)).filter(Boolean)
        : [],
      options: entity.foodOptions?.length
        ? entity.foodOptions.map(opt => this.toFoodOptionDetailDto(opt)).filter(Boolean)
        : [],
    };
  }

  static toFoodListResponse(entity: Food): FoodDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      basePrice: Number(entity.basePrice),
      imageUrl: entity.imageUrl ?? null,
      cookingTime: entity.cookingTime ?? null,
      ordering: entity.ordering,
      status: entity.status,
      category: CategoryMapper.toResponse(entity.category),
      tags: entity.foodTags?.length
        ? entity.foodTags.map(ft => TagMapper.toResponse(ft.tag)).filter(Boolean)
        : [],
      options: [],
    };
  }

  static toAutoCompleteResponse(entity: Food): FoodDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      basePrice: Number(entity.basePrice),
      imageUrl: entity.imageUrl ?? null,
      cookingTime: entity.cookingTime ?? null,
    };
  }

  static toResponseList(entities: Food[]): FoodDto[] {
    return entities.map(entity => this.toFoodListResponse(entity));
  }

  static toAutoCompleteResponseList(entities: Food[]): FoodDto[] {
    return entities.map(entity => this.toAutoCompleteResponse(entity));
  }
}
