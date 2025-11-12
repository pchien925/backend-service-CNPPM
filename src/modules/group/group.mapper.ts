import { GroupDto } from './dtos/group.dto';
import { Group } from './entities/group.entity';

export class GroupMapper {
  static toResponse(entity: Group): GroupDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      kind: entity.kind,
    };
  }

  static toResponseList(entities: Group[]): GroupDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
