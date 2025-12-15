import { Nation } from './entities/nation.entity';
import { CreateNationDto } from './dtos/create-nation.dto';
import { UpdateNationDto } from './dtos/update-nation.dto';
import { NationDto } from './dtos/nation.dto';

export class NationMapper {
  static toEntityFromCreate(dto: CreateNationDto): Nation {
    const entity = new Nation();
    entity.name = dto.name;
    entity.postalCode = dto.postalCode;
    entity.kind = dto.kind;
    return entity;
  }

  static toEntityFromUpdate(entity: Nation, dto: UpdateNationDto): Nation {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.postalCode !== undefined) entity.postalCode = dto.postalCode;
    if (dto.kind !== undefined) entity.kind = dto.kind;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: Nation): NationDto {
    const dto: NationDto = {
      id: entity.id,
      name: entity.name,
      postalCode: entity.postalCode ?? null,
      kind: entity.kind,
      status: entity.status,
    };

    if (entity.parent) {
      dto.parent = this.toResponse(entity.parent);
    }

    return dto;
  }

  static toResponseList(entities: Nation[]): NationDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
