import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryDto } from './dtos/category.dto';

export class CategoryMapper {
  static toEntityFromCreate(dto: CreateCategoryDto): Category {
    const entity = new Category();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.kind = dto.kind ?? 0;
    entity.imageUrl = dto.imageUrl;
    entity.ordering = dto.ordering ?? 0;
    return entity;
  }

  static toEntityFromUpdate(entity: Category, dto: UpdateCategoryDto): Category {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.kind !== undefined) entity.kind = dto.kind;
    if (dto.imageUrl !== undefined) entity.imageUrl = dto.imageUrl;
    if (dto.ordering !== undefined) entity.ordering = dto.ordering;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: Category): CategoryDto {
    if (!entity) return null;
    const dto: CategoryDto = {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      kind: entity.kind,
      imageUrl: entity.imageUrl ?? null,
      ordering: entity.ordering,
      status: entity.status,
    };

    if (entity.children) {
      dto.children = this.toResponseList(entity.children);
    }

    return dto;
  }

  static toBasicResponse(entity: Category): CategoryDto {
    if (!entity) return null;
    const dto: CategoryDto = {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      kind: entity.kind,
      imageUrl: entity.imageUrl ?? null,
      ordering: entity.ordering,
    };

    return dto;
  }

  static toResponseList(entities: Category[]): CategoryDto[] {
    if (!entities?.length) return [];
    return entities.map(entity => this.toResponse(entity));
  }

  static toBasicResponseList(entities: Category[]): CategoryDto[] {
    if (!entities?.length) return [];
    return entities.map(entity => this.toBasicResponse(entity));
  }
}
