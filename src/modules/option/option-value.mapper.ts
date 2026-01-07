import { CreateOptionValueDto } from './dtos/create-option-value.dto';
import { OptionValueDto } from './dtos/option-value.dto';
import { UpdateOptionValueDto } from './dtos/update-option-value.dto';
import { OptionValue } from './entities/option-value.entity';

export class OptionValueMapper {
  static toEntityFromCreate(dto: CreateOptionValueDto): OptionValue {
    const entity = new OptionValue();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.extraPrice = dto.extraPrice;
    entity.ordering = dto.ordering ?? 0;
    return entity;
  }

  static toEntityFromUpdate(entity: OptionValue, dto: UpdateOptionValueDto): OptionValue {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.extraPrice !== undefined) entity.extraPrice = dto.extraPrice;
    if (dto.ordering !== undefined) entity.ordering = dto.ordering;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: OptionValue): OptionValueDto {
    if (!entity) return null;
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      extraPrice: Number(entity.extraPrice),
      ordering: entity.ordering,
      status: entity.status,
    };
  }

  static toResponseList(entities: OptionValue[]): OptionValueDto[] {
    if (!entities?.length) return [];
    return entities.map(entity => this.toResponse(entity));
  }
}
