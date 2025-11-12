import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionDto } from './dtos/permission.dto';
import { PermissionMapper } from './permission.mapper';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<PermissionDto> {
    const entity = PermissionMapper.toEntityFromCreate(dto);
    const saved = await this.repo.save(entity);
    return PermissionMapper.toResponse(saved);
  }

  async findAll(): Promise<PermissionDto[]> {
    const entities = await this.repo.find();
    return PermissionMapper.toResponseList(entities);
  }
}
