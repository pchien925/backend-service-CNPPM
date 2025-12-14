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
    entity.minSelect = dto.minSelect ?? 0;
    entity.maxSelect = dto.maxSelect ?? 1;
    entity.ordering = dto.ordering ?? 0;
    return entity;
  }

  static toResponse(entity: ComboGroup): ComboGroupDto {
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

  static toEntityPartialFromUpdate(dto: UpdateComboGroupDto): Partial<ComboGroup> {
    return {
      name: dto.name,
      description: dto.description,
      minSelect: dto.minSelect,
      maxSelect: dto.maxSelect,
      ordering: dto.ordering,
      status: dto.status,
    };
  }
}
