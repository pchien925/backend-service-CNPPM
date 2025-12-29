import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { AddressDto } from './dtos/address.dto';
import { NationMapper } from '../nation/nation.mapper';
import { UpdateAddressDto } from './dtos/update-address.dto';

export class AddressMapper {
  static toEntityFromCreate(dto: CreateAddressDto): Address {
    const entity = new Address();
    entity.recipientName = dto.recipientName;
    entity.phone = dto.phone;
    entity.addressLine = dto.addressLine;
    entity.isDefault = dto.isDefault ?? false;
    return entity;
  }

  static toEntityFromUpdate(entity: Address, dto: UpdateAddressDto): Address {
    if (dto.recipientName !== undefined) entity.recipientName = dto.recipientName;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.addressLine !== undefined) entity.addressLine = dto.addressLine;
    if (dto.isDefault !== undefined) entity.isDefault = dto.isDefault;
    return entity;
  }

  static toResponse(entity: Address): AddressDto {
    if (!entity) return null;
    return {
      id: entity.id,
      recipientName: entity.recipientName,
      phone: entity.phone,
      addressLine: entity.addressLine,
      isDefault: entity.isDefault,
      status: entity.status,
      province: entity.province ? NationMapper.toResponse(entity.province) : null,
      district: entity.district ? NationMapper.toResponse(entity.district) : null,
      ward: entity.ward ? NationMapper.toResponse(entity.ward) : null,
    };
  }

  static toResponseList(entities: Address[]): AddressDto[] {
    if (!entities?.length) return [];
    return entities.map(entity => this.toResponse(entity));
  }
}
