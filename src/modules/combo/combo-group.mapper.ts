import { ComboGroupItemMapper } from './combo-group-item.mapper';
import { ComboGroupDto } from './dtos/combo-group.dto';
import { CreateComboGroupDto } from './dtos/create-combo-group.dto';
import { UpdateComboGroupDto } from './dtos/update-combo-group.dto';
import { ComboGroup } from './entities/combo-group.entity';

export class ComboGroupMapper {
  static toEntityFromCreate(dto: CreateComboGroupDto): ComboGroup {
    const entity = new ComboGroup();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.minSelect = dto.minSelect;
    entity.maxSelect = dto.maxSelect;
    entity.ordering = dto.ordering ?? 0;
    return entity;
  }

  static toEntityFromUpdate(entity: ComboGroup, dto: UpdateComboGroupDto): ComboGroup {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.minSelect !== undefined) entity.minSelect = dto.minSelect;
    if (dto.maxSelect !== undefined) entity.maxSelect = dto.maxSelect;
    if (dto.ordering !== undefined) entity.ordering = dto.ordering;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: ComboGroup): ComboGroupDto {
    if (!entity) return null;
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      minSelect: entity.minSelect,
      maxSelect: entity.maxSelect,
      ordering: entity.ordering,
      items: entity.items ? entity.items.map(item => ComboGroupItemMapper.toResponse(item)) : [],
    };
  }

  static toResponseList(entities: ComboGroup[]): ComboGroupDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
