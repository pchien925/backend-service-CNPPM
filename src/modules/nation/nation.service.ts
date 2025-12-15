import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  NATION_KIND_DISTRICT,
  NATION_KIND_PROVINCE,
  NATION_KIND_WARD,
  STATUS_ACTIVE,
  STATUS_DELETE,
} from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { DataSource, ILike, IsNull, Not, Repository } from 'typeorm';
import { CreateNationDto } from './dtos/create-nation.dto';
import { NationQueryDto } from './dtos/nation-query.dto';
import { NationDto } from './dtos/nation.dto';
import { UpdateNationDto } from './dtos/update-nation.dto';
import { Nation } from './entities/nation.entity';
import { NationMapper } from './nation.mapper';
import { NationSpecification } from './specification/nation.specification';

@Injectable()
export class NationService {
  constructor(
    @InjectRepository(Nation)
    private readonly nationRepo: Repository<Nation>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  private validateNationKind(
    kind: number,
    parentId: string | null | undefined,
    parentNation: Nation | null | undefined,
  ): void {
    const validKinds = [NATION_KIND_WARD, NATION_KIND_DISTRICT, NATION_KIND_PROVINCE];

    if (!validKinds.includes(kind)) {
      throw new BadRequestException(
        `Invalid nation kind: ${kind}. Must be 1 (Ward), 2 (District), or 3 (Province).`,
        ErrorCode.NATION_ERROR_INVALID_KIND,
      );
    }

    const isParentIdPresent = parentId !== null && parentId !== '' && parentId !== undefined;

    if (kind === NATION_KIND_PROVINCE) {
      if (isParentIdPresent) {
        throw new BadRequestException(
          `Province (Kind 3) cannot have a parent nation.`,
          ErrorCode.NATION_ERROR_INVALID_HIERARCHY,
        );
      }
    } else if (kind === NATION_KIND_DISTRICT) {
      if (!isParentIdPresent) {
        throw new BadRequestException(
          `District (Kind 2) must have a parent nation (Kind 3).`,
          ErrorCode.NATION_ERROR_INVALID_HIERARCHY,
        );
      }
      if (parentNation?.kind !== NATION_KIND_PROVINCE) {
        throw new BadRequestException(
          `District (Kind 2) parent must be a Province (Kind 3).`,
          ErrorCode.NATION_ERROR_INVALID_HIERARCHY,
        );
      }
    } else if (kind === NATION_KIND_WARD) {
      if (!isParentIdPresent) {
        throw new BadRequestException(
          `Ward (Kind 1) must have a parent nation (Kind 2).`,
          ErrorCode.NATION_ERROR_INVALID_HIERARCHY,
        );
      }
      if (parentNation?.kind !== NATION_KIND_DISTRICT) {
        throw new BadRequestException(
          `Ward (Kind 1) parent must be a District (Kind 2).`,
          ErrorCode.NATION_ERROR_INVALID_HIERARCHY,
        );
      }
    }
  }

  async create(dto: CreateNationDto): Promise<void> {
    const { name, parentId, kind } = dto;

    let parentNation: Nation | undefined;
    if (parentId) {
      parentNation = await this.nationRepo.findOneBy({ id: parentId, status: STATUS_ACTIVE });
      if (!parentNation) {
        throw new NotFoundException(`Parent Nation not found.`, ErrorCode.NATION_ERROR_NOT_FOUND);
      }
    }

    this.validateNationKind(kind, parentId, parentNation);

    const existingWhere: any = { name: ILike(name), kind: dto.kind };
    if (parentId) {
      existingWhere.parent = { id: parentId };
    } else {
      existingWhere.parent = IsNull();
    }

    const existingNation = await this.nationRepo.findOne({ where: existingWhere });

    if (existingNation) {
      throw new BadRequestException(
        `Nation name already exists for this kind/parent.`,
        ErrorCode.NATION_ERROR_NAME_EXISTS,
      );
    }

    const entity = NationMapper.toEntityFromCreate(dto);
    entity.parent = parentNation;
    await this.nationRepo.save(entity);
  }

  async findAll(query: NationQueryDto): Promise<NationDto[]> {
    const { page = 1, limit = 10 } = query;

    const filterSpec = new NationSpecification(query);
    const where = filterSpec.toWhere();

    const entities = await this.nationRepo.find({
      where,
      //   relations: ['parent'],
      order: { name: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NationMapper.toResponseList(entities);
  }

  async findOne(id: string): Promise<NationDto> {
    const entity = await this.nationRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['parent'],
    });
    if (!entity) {
      throw new NotFoundException(`Nation not found.`, ErrorCode.NATION_ERROR_NOT_FOUND);
    }
    return NationMapper.toResponse(entity);
  }

  async update(dto: UpdateNationDto): Promise<void> {
    const { id, parentId, name, kind: newKind } = dto;

    const entity = await this.nationRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['parent'],
    });
    if (!entity) {
      throw new NotFoundException(`Nation not found.`, ErrorCode.NATION_ERROR_NOT_FOUND);
    }
    const currentKind = newKind ?? entity.kind;

    let parentNation: Nation | null | undefined = entity.parent;
    let newParentId: string | null | undefined = parentId;

    if (newParentId !== undefined) {
      if (newParentId === null || newParentId === '') {
        parentNation = null;
        newParentId = null;
      } else {
        parentNation = await this.nationRepo.findOneBy({ id: newParentId, status: STATUS_ACTIVE });
        if (!parentNation) {
          throw new NotFoundException(`Parent Nation not found.`, ErrorCode.NATION_ERROR_NOT_FOUND);
        }
      }
    } else {
      newParentId = entity.parent?.id;
    }
    this.validateNationKind(currentKind, newParentId, parentNation);

    if (newKind !== undefined && newKind !== entity.kind) {
      const childrenCount = await this.nationRepo.count({
        where: { parent: { id: id }, status: Not(STATUS_DELETE) },
      });

      if (childrenCount > 0) {
        throw new BadRequestException(
          `Cannot change kind of a Nation that has active child nations.`,
          ErrorCode.NATION_ERROR_KIND_CHANGE_BLOCKED,
        );
      }
    }

    if (name !== undefined && name !== entity.name) {
      const currentParentId = parentNation?.id;
      const existingWhere: any = { name: ILike(name), id: Not(id), kind: dto.kind ?? entity.kind };

      if (currentParentId) {
        existingWhere.parent = { id: currentParentId };
      } else {
        existingWhere.parent = IsNull();
      }

      const existingNation = await this.nationRepo.findOne({ where: existingWhere });

      if (existingNation) {
        throw new BadRequestException(
          `Nation name already exists for this parent/kind.`,
          ErrorCode.NATION_ERROR_NAME_EXISTS,
        );
      }
    }

    const updatedEntity = NationMapper.toEntityFromUpdate(entity, dto);
    updatedEntity.parent = parentNation;
    await this.nationRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const nationToDelete = await this.nationRepo.findOneBy({ id });

    if (!nationToDelete) {
      throw new NotFoundException(`Nation not found.`, ErrorCode.NATION_ERROR_NOT_FOUND);
    }

    try {
      await this.recursiveHardDelete(id);
    } catch (error) {
      if (error.message.includes('Foreign Key')) {
        throw new BadRequestException(
          `Nation cannot be deleted as it is currently in use by other records (e.g., Branches or Addresses).`,
          ErrorCode.NATION_ERROR_IN_USED,
        );
      }
      throw error;
    }
  }

  private async recursiveHardDelete(nationId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const children = await queryRunner.manager.find(Nation, {
        where: { parent: { id: nationId } },
        select: ['id'],
      });

      for (const child of children) {
        await this.recursiveHardDelete(child.id);
      }

      await queryRunner.manager.delete(Nation, nationId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error during recursive hard delete for Nation ID ${nationId}:`, error);
      throw new Error(`Failed to perform recursive hard delete.`); // Hoặc custom exception
    } finally {
      await queryRunner.release();
    }
  }
}
