import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionDto } from './dtos/permission.dto';

export class PermissionMapper {
  static toEntityFromCreate(dto: CreatePermissionDto): Permission {
    const entity = new Permission();
    entity.name = dto.name;
    entity.permissionCode = dto.permissionCode;
    entity.action = dto.action;
    entity.showMenu = dto.showMenu ?? false;
    entity.description = dto.description;
    entity.nameGroup = dto.nameGroup;
    return entity;
  }

  static toResponse(entity: Permission): PermissionDto {
    return {
      id: entity.id,
      name: entity.name,
      permissionCode: entity.permissionCode,
      action: entity.action,
      showMenu: entity.showMenu,
      description: entity.description,
      nameGroup: entity.nameGroup,
    };
  }

  static toResponseList(entities: Permission[]): PermissionDto[] {
    return entities.map(this.toResponse);
  }
}
