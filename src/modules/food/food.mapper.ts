import { CategoryMapper } from '../category/category.mapper';
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
      tags: entity.foodTags ? entity.foodTags.map(tag => TagMapper.toResponse(tag.tag)) : [],
      options: entity.foodOptions ? entity.foodOptions.map(this.toFoodOptionDetailDto) : [],
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
      tags: [],
      options: [],
    };
  }
}
