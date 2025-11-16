import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionDto } from './dtos/permission.dto';
import { PermissionMapper } from './permission.mapper';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<void> {
    const entity = PermissionMapper.toEntityFromCreate(dto);
    await this.repo.save(entity);
  }

  async findAll(): Promise<ResponseListDto<PermissionDto[]>> {
    const [entities, totalElements] = await this.repo.findAndCount();
    const content = PermissionMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, content.length);
  }
}
