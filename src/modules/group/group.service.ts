import { Injectable } from '@nestjs/common';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { GroupDto } from './dtos/group.dto';
import { GroupMapper } from './group.mapper';
import { CreateGroupDto } from './dtos/create-group.dto';
import { Permission } from '../permission/entities/permission.entity';
import { GroupQueryDto } from './dtos/groups-query.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreateGroupDto): Promise<void> {
    const entity = GroupMapper.toEntityFromCreate(dto);
    const permissions = await this.permissionRepo.find({
      where: { id: In(dto.permissions) },
    });
    entity.permissions = permissions;
    await this.groupRepo.save(entity);
  }

  async findAll(query: GroupQueryDto): Promise<ResponseListDto<GroupDto[]>> {
    const { page = 0, limit, name, description, kind } = query;

    const where: any = {};
    if (name) where.name = ILike(`%${name}%`);
    if (description) where.description = ILike(`%${description}%`);
    if (kind !== undefined) where.kind = kind;

    const [entities, totalElements] = await this.groupRepo.findAndCount({
      where,
      relations: ['permissions'],
      order: { id: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    const content = GroupMapper.toResponseList(entities);

    return new ResponseListDto(content, totalElements, limit);
  }
}
