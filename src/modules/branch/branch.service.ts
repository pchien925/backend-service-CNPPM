import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { ILike, Not, Repository } from 'typeorm';
import { BranchMapper } from './branch.mapper';
import { BranchQueryDto } from './dtos/branch-query.dto';
import { BranchDto } from './dtos/branch.dto';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { BranchSpecification } from './specification/branch.specification';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async create(dto: CreateBranchDto): Promise<void> {
    const existing = await this.branchRepo.findOne({ where: { name: ILike(dto.name) } });
    if (existing)
      throw new BadRequestException(
        `Branch name already exists.`,
        ErrorCode.BRANCH_ERROR_NAME_EXISTS,
      );

    const entity = BranchMapper.toEntityFromCreate(dto);
    await this.branchRepo.save(entity);
  }

  async findAll(query: BranchQueryDto): Promise<ResponseListDto<BranchDto[]>> {
    const { page = 0, limit = 10 } = query;
    const [entities, total] = await this.branchRepo.findAndCount({
      where: new BranchSpecification(query).toWhere(),
      order: { id: 'ASC' },
      skip: page * limit,
      take: limit,
    });
    return new ResponseListDto(BranchMapper.toResponseList(entities), total, limit);
  }
  async autoComplete(query: BranchQueryDto): Promise<ResponseListDto<BranchDto[]>> {
    const { page = 0, limit = 10 } = query;

    const filterSpec = new BranchSpecification(query);
    const where = filterSpec.toWhere();

    where.status = STATUS_ACTIVE;

    const [entities, totalElements] = await this.branchRepo.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = BranchMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<BranchDto> {
    const entity = await this.branchRepo.findOneBy({ id, status: STATUS_ACTIVE });
    if (!entity) throw new NotFoundException(`Branch not found.`, ErrorCode.BRANCH_ERROR_NOT_FOUND);
    return BranchMapper.toResponse(entity);
  }

  async update(dto: UpdateBranchDto): Promise<void> {
    const entity = await this.branchRepo.findOneBy({ id: dto.id });
    if (!entity) throw new NotFoundException(`Branch not found.`, ErrorCode.BRANCH_ERROR_NOT_FOUND);

    if (dto.name && dto.name !== entity.name) {
      const duplicate = await this.branchRepo.findOne({
        where: { name: ILike(dto.name), id: Not(dto.id) },
      });
      if (duplicate)
        throw new BadRequestException(
          `Branch name already exists.`,
          ErrorCode.BRANCH_ERROR_NAME_EXISTS,
        );
    }

    const updatedEntity = BranchMapper.toEntityFromUpdate(entity, dto);
    await this.branchRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.branchRepo.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException('Branch not found.', ErrorCode.BRANCH_ERROR_NOT_FOUND);
  }
}
