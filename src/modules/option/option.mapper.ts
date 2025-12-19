import { CreateOptionDto } from './dtos/create-option.dto';
import { OptionDto } from './dtos/option.dto';
import { UpdateOptionDto } from './dtos/update-option.dto';
import { Option } from './entities/option.entity';
import { OptionValueMapper } from './option-value.mapper';

export class OptionMapper {
  static toEntityFromCreate(dto: CreateOptionDto): Option {
    const entity = new Option();
    entity.name = dto.name;
    entity.image = dto.image;
    entity.description = dto.description;
    return entity;
  }

  static toEntityFromUpdate(entity: Option, dto: UpdateOptionDto): Option {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.image !== undefined) entity.image = dto.image;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: Option): OptionDto {
    return {
      id: entity.id,
      name: entity.name,
      image: entity.image ?? null,
      description: entity.description ?? null,
      status: entity.status,
    };
  }

  static toDetailResponse(entity: Option): OptionDto {
    return {
      ...this.toResponse(entity),
      values: entity.values?.length ? OptionValueMapper.toResponseList(entity.values) : [],
    };
  }

  static toResponseList(entities: Option[]): OptionDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
