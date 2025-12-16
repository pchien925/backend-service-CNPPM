import { PermissionMapper } from '../permission/permission.mapper';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupDto } from './dtos/group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { Group } from './entities/group.entity';

export class GroupMapper {
  static toEntityFromCreate(dto: CreateGroupDto): Group {
    const entity = new Group();
    entity.name = dto.name;
    entity.kind = dto.kind;
    entity.description = dto.description;
    return entity;
  }

  static toEntityFromUpdate(entity: Group, dto: UpdateGroupDto): Group {
    if (dto.name) entity.name = dto.name;
    if (dto.kind !== undefined) entity.kind = dto.kind;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: Group): GroupDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      kind: entity.kind,
    };
  }

  static toDetailResponse(entity: Group): GroupDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      kind: entity.kind,
      permissions: entity.permissions?.length
        ? PermissionMapper.toResponseList(entity.permissions)
        : [],
    };
  }

  static toResponseList(entities: Group[]): GroupDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
