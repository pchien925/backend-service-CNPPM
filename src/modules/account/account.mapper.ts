import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { AccountDto } from './dtos/account.dto';
import { Group } from '../group/entities/group.entity';
import { GroupMapper } from '../group/group.mapper';

export class AccountMapper {
  static toEntityFromCreate(dto: CreateAccountDto): Account {
    const entity = new Account();
    entity.kind = dto.kind;
    entity.username = dto.username;
    entity.email = dto.email;
    entity.password = dto.password;
    entity.fullName = dto.fullName;
    entity.phone = dto.phone;
    entity.avatarPath = dto.avatarPath;
    if (dto.groupId) {
      entity.group = { id: dto.groupId } as Group;
    }
    return entity;
  }

  static toEntityFromUpdate(entity: Account, dto: UpdateAccountDto): Account {
    if (dto.username !== undefined) entity.username = dto.username;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.password !== undefined) entity.password = dto.password;
    if (dto.fullName !== undefined) entity.fullName = dto.fullName;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.avatarPath !== undefined) entity.avatarPath = dto.avatarPath;
    return entity;
  }

  static toResponse(entity: Account): AccountDto {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      fullName: entity.fullName,
      phone: entity.phone,
      group: entity.group ? GroupMapper.toResponse(entity.group) : null,
      avatarPath: entity.avatarPath,
    };
  }

  static toDetailResponse(entity: Account): AccountDto {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      fullName: entity.fullName,
      phone: entity.phone,
      avatarPath: entity.avatarPath,
      group: entity.group ? GroupMapper.toDetailResponse(entity.group) : null,
    };
  }

  static toResponseList(entities: Account[]): AccountDto[] {
    return entities.map(e => this.toResponse(e));
  }
}
