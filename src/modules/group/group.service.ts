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
import { NotFoundException } from 'src/exception/not-found.exception';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { GroupSpecification } from './specification/group.specification';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { STATUS_ACTIVE } from 'src/constants/app.constant';

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
    const { page = 0, limit = 10 } = query;

    const spec = new GroupSpecification(query);
    const where = spec.toWhere();

    const [entities, totalElements] = await this.groupRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    const content = GroupMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async autoComplete(query: GroupQueryDto): Promise<ResponseListDto<GroupDto[]>> {
    const { page = 0, limit = 10 } = query;

    const spec = new GroupSpecification(query);
    const where = spec.toWhere();

    where.status = STATUS_ACTIVE;

    const [entities, totalElements] = await this.groupRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    const content = GroupMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<GroupDto> {
    const entity = await this.groupRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!entity) {
      throw new NotFoundException('Group not found', ErrorCode.GROUP_ERROR_NOT_FOUND);
    }

    return GroupMapper.toDetailResponse(entity);
  }

  async update(dto: UpdateGroupDto): Promise<void> {
    const { id, permissions: permissionIds } = dto;

    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!group) {
      throw new NotFoundException('Group not found', ErrorCode.GROUP_ERROR_NOT_FOUND);
    }

    GroupMapper.toEntityFromUpdate(group, dto);

    if (permissionIds) {
      const permissions = await this.permissionRepo.find({
        where: { id: In(permissionIds) },
      });
      group.permissions = permissions;
    }

    await this.groupRepo.save(group);
  }

  async delete(id: string): Promise<void> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['accounts'],
    });

    if (!group) {
      throw new NotFoundException('Group not found', ErrorCode.GROUP_ERROR_NOT_FOUND);
    }

    if (group.accounts && group.accounts.length > 0) {
      throw new BadRequestException(
        'Cannot delete group that has assigned accounts',
        ErrorCode.GROUP_ERROR_IN_USED,
      );
    }

    await this.groupRepo.remove(group);
  }
}
