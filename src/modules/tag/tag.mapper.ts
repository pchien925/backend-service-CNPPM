import { CreateTagDto } from './dtos/create-tag.dto';
import { TagDto } from './dtos/tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { Tag } from './entities/tag.entity';

export class TagMapper {
  static toEntityFromCreate(dto: CreateTagDto): Tag {
    const entity = new Tag();
    entity.name = dto.name;
    entity.color = dto.color;
    return entity;
  }

  static toEntityFromUpdate(entity: Tag, dto: UpdateTagDto): Tag {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.color !== undefined) entity.color = dto.color;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: Tag): TagDto {
    if (!entity) return null;
    return {
      id: entity.id,
      name: entity.name,
      color: entity.color ?? null,
      status: entity.status,
    };
  }

  static toResponseList(entities: Tag[]): TagDto[] {
    if (!entities?.length) return [];
    return entities.map(entity => this.toResponse(entity));
  }
}
