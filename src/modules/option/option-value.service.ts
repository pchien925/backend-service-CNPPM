import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  STATUS_ACTIVE,
  STATUS_DELETE,
  STATUS_INACTIVE,
  STATUS_PENDING,
} from 'src/constants/app.constant';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateOptionValueDto } from './dtos/create-option-value.dto';
import { OptionValueQueryDto } from './dtos/option-value-query.dto';
import { OptionValueDto } from './dtos/option-value.dto';
import { UpdateOptionValueDto } from './dtos/update-option-value.dto';
import { OptionValue } from './entities/option-value.entity';
import { Option } from './entities/option.entity';
import { OptionValueMapper } from './option-value.mapper';
import { OptionValueSpecification } from './specification/option-value.specification';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@Injectable()
export class OptionValueService {
  constructor(
    @InjectRepository(OptionValue)
    private readonly optionValueRepo: Repository<OptionValue>,
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async create(dto: CreateOptionValueDto): Promise<void> {
    const option = await this.optionRepo.findOneBy({
      id: dto.optionId,
      status: STATUS_ACTIVE,
    });
    if (!option) {
      throw new NotFoundException(` not found.`, ErrorCode.OPTION_ERROR_NOT_FOUND);
    }
    const existingValue = await this.optionValueRepo.findOne({
      where: {
        name: ILike(dto.name),
        option: { id: dto.optionId },
        status: Not(STATUS_DELETE),
      },
    });

    if (existingValue) {
      throw new BadRequestException(
        `Option Value name already exists for this Option.`,
        ErrorCode.OPTION_VALUE_ERROR_NAME_EXISTS,
      );
    }
    const entity = OptionValueMapper.toEntityFromCreate(dto);
    entity.option = option;
    await this.optionValueRepo.save(entity);
  }

  async findAllByOption(query: OptionValueQueryDto): Promise<ResponseListDto<OptionValueDto[]>> {
    const { page = 0, limit = 10 } = query;

    const filterSpec = new OptionValueSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.optionValueRepo.findAndCount({
      where,
      order: { ordering: 'ASC', id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = OptionValueMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<OptionValueDto> {
    const entity = await this.optionValueRepo.findOneBy({
      id,
      status: Not(STATUS_DELETE),
    });
    if (!entity) {
      throw new NotFoundException(
        `Option value not found.`,
        ErrorCode.OPTION_VALUE_ERROR_NOT_FOUND,
      );
    }
    return OptionValueMapper.toResponse(entity);
  }

  async update(dto: UpdateOptionValueDto): Promise<void> {
    const entity = await this.optionValueRepo.findOne({
      where: {
        id: dto.id,
        status: Not(STATUS_DELETE),
      },
      relations: ['option'],
    });
    if (!entity) {
      throw new NotFoundException(
        `Option value not found.`,
        ErrorCode.OPTION_VALUE_ERROR_NOT_FOUND,
      );
    }
    const existingValue = await this.optionValueRepo.findOne({
      where: {
        id: Not(dto.id),
        name: ILike(dto.name),
        option: { id: entity.option.id },
        status: Not(STATUS_DELETE),
      },
    });

    if (existingValue) {
      throw new BadRequestException(
        `Option value name already exists.`,
        ErrorCode.OPTION_VALUE_ERROR_NAME_EXISTS,
      );
    }

    const updatedEntity = OptionValueMapper.toEntityFromUpdate(entity, dto);
    await this.optionValueRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.optionValueRepo.update({ id }, { status: STATUS_DELETE });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Option value not found.`,
        ErrorCode.OPTION_VALUE_ERROR_NOT_FOUND,
      );
    }
  }
}
