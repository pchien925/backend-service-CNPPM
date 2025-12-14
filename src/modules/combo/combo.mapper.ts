import { CategoryMapper } from 'src/modules/category/category.mapper';
import { Category } from 'src/modules/category/entities/category.entity'; // Import Category Entity
import { TagMapper } from 'src/modules/tag/tag.mapper';
import { ComboDto } from './dtos/combo.dto';
import { CreateComboDto } from './dtos/create-combo.dto';
import { UpdateComboDto } from './dtos/update-combo.dto';
import { Combo } from './entities/combo.entity';

export class ComboMapper {
  static toEntityFromCreate(dto: CreateComboDto): Combo {
    const entity = new Combo();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.basePrice = dto.basePrice;
    entity.imageUrl = dto.imageUrl;
    entity.cookingTime = dto.cookingTime;
    entity.ordering = dto.ordering ?? 0;

    // ⭐ SỬA ĐỔI: Thiết lập quan hệ Category
    if (dto.categoryId) {
      // Tạo Category Entity giả để thiết lập FK qua mối quan hệ
      const categoryEntity = new Category();
      categoryEntity.id = dto.categoryId;
      entity.category = categoryEntity;
    }

    return entity;
  }

  static toEntityFromUpdate(entity: Combo, dto: UpdateComboDto): Combo {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.basePrice !== undefined) entity.basePrice = dto.basePrice;
    if (dto.imageUrl !== undefined) entity.imageUrl = dto.imageUrl;
    if (dto.cookingTime !== undefined) entity.cookingTime = dto.cookingTime;
    if (dto.ordering !== undefined) entity.ordering = dto.ordering;
    if (dto.status !== undefined) entity.status = dto.status;

    if (dto.categoryId !== undefined) {
      const categoryEntity = new Category();
      categoryEntity.id = dto.categoryId;
      entity.category = categoryEntity;
    }

    // Lưu ý: Status update logic (nếu có)

    return entity;
  }

  static toResponse(entity: Combo): ComboDto {
    const dto: ComboDto = {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      basePrice: entity.basePrice,
      imageUrl: entity.imageUrl ?? null,
      cookingTime: entity.cookingTime ?? null,
      ordering: entity.ordering,
      status: entity.status,
      category: entity.category ? CategoryMapper.toResponse(entity.category) : null,
      tags: entity.comboTags ? entity.comboTags.map(ct => TagMapper.toResponse(ct.tag)) : [],
    };
    return dto;
  }

  static toResponseList(entities: Combo[]): ComboDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
