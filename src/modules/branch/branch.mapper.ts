import { BranchDto } from './dtos/branch.dto';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';
import { Branch } from './entities/branch.entity';

export class BranchMapper {
  static toEntityFromCreate(dto: CreateBranchDto): Branch {
    const entity = new Branch();
    entity.name = dto.name;
    entity.location = dto.location;
    entity.phone = dto.phone;
    entity.imageUrl = dto.imageUrl;
    return entity;
  }

  static toEntityFromUpdate(entity: Branch, dto: UpdateBranchDto): Branch {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.location !== undefined) entity.location = dto.location;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.imageUrl !== undefined) entity.imageUrl = dto.imageUrl;
    if (dto.status !== undefined) entity.status = dto.status;
    return entity;
  }

  static toResponse(entity: Branch): BranchDto {
    if (!entity) return null;
    return {
      id: entity.id,
      name: entity.name,
      location: entity.location,
      phone: entity.phone,
      imageUrl: entity.imageUrl,
      status: entity.status,
    };
  }

  static toResponseList(entities: Branch[]): BranchDto[] {
    return entities?.map(entity => this.toResponse(entity)) || [];
  }
}
