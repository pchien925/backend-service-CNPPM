import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { ILike, Not, Repository } from 'typeorm';
import { CreateOptionDto } from './dtos/create-option.dto';
import { OptionQueryDto } from './dtos/option-query.dto';
import { OptionDto } from './dtos/option.dto';
import { UpdateOptionDto } from './dtos/update-option.dto';
import { Option } from './entities/option.entity';
import { OptionMapper } from './option.mapper';
import { OptionSpecification } from './specification/option.specification';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async create(dto: CreateOptionDto): Promise<void> {
    const existingOption = await this.optionRepo.findOne({
      where: {
        name: ILike(dto.name),
        status: Not(STATUS_DELETE),
      },
    });

    if (existingOption) {
      throw new BadRequestException(
        `Option name already exists.`,
        ErrorCode.OPTION_ERROR_NAME_EXISTS,
      );
    }
    const entity = OptionMapper.toEntityFromCreate(dto);
    await this.optionRepo.save(entity);
  }

  async findAll(query: OptionQueryDto): Promise<ResponseListDto<OptionDto[]>> {
    const { page = 1, limit = 10 } = query;

    const spec = new OptionSpecification(query);
    const where = spec.toWhere();

    const [entities, totalElements] = await this.optionRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const content = OptionMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<OptionDto> {
    const entity = await this.optionRepo.findOne({
      where: { id },
      relations: ['values'],
    });

    if (!entity) {
      throw new NotFoundException(`Option not found.`, ErrorCode.OPTION_ERROR_NOT_FOUND);
    }

    return OptionMapper.toDetailResponse(entity);
  }

  async update(dto: UpdateOptionDto): Promise<void> {
    const entity = await this.optionRepo.findOneBy({
      id: dto.id,
      status: Not(STATUS_DELETE),
    });

    if (!entity) {
      throw new NotFoundException(`Option not found.`, ErrorCode.OPTION_ERROR_NOT_FOUND);
    }

    const existingOption = await this.optionRepo.findOne({
      where: { name: ILike(dto.name), id: Not(dto.id) },
    });

    if (existingOption) {
      throw new BadRequestException(
        `Option name already exists.`,
        ErrorCode.OPTION_ERROR_NAME_EXISTS,
      );
    }

    const updatedEntity = OptionMapper.toEntityFromUpdate(entity, dto);
    await this.optionRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.optionRepo.update({ id }, { status: STATUS_DELETE });

    if (result.affected === 0) {
      throw new NotFoundException(`Option not found.`, ErrorCode.OPTION_ERROR_NOT_FOUND);
    }
  }
}
