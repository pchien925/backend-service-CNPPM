import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { DataSource, Not, Repository } from 'typeorm';
import { ComboGroupMapper } from './combo-group.mapper';
import { ComboGroupSortItemDto } from './dtos/combo-group-sort.dto';
import { ComboGroupDto } from './dtos/combo-group.dto';
import { ComboGroupQueryDto } from './dtos/combo-group.query.dto';
import { CreateComboGroupDto } from './dtos/create-combo-group.dto';
import { UpdateComboGroupDto } from './dtos/update-combo-group.dto';
import { ComboGroup } from './entities/combo-group.entity';
import { Combo } from './entities/combo.entity';
import { ComboGroupSpecification } from './specification/combo-group.specification';

@Injectable()
export class ComboGroupService {
  constructor(
    @InjectRepository(Combo) private readonly comboRepo: Repository<Combo>,
    @InjectRepository(ComboGroup) private readonly comboGroupRepo: Repository<ComboGroup>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateComboGroupDto): Promise<void> {
    const combo = await this.comboRepo.findOneBy({
      id: dto.comboId,
      status: Not(STATUS_DELETE),
    });

    if (!combo) {
      throw new NotFoundException('Combo not found', ErrorCode.COMBO_ERROR_NOT_FOUND);
    }

    const entity = ComboGroupMapper.toEntityFromCreate(dto);
    entity.combo = combo;

    await this.comboGroupRepo.save(entity);
  }

  async findAll(query: ComboGroupQueryDto): Promise<ResponseListDto<ComboGroupDto[]>> {
    const { page = 0, limit = 1000 } = query;
    const filterSpec = new ComboGroupSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.comboGroupRepo.findAndCount({
      where,
      relations: [
        'combo',
        'items',
        'items.food',
        'items.food.category',
        'items.food.foodTags.tag',
        'items.food.foodOptions.option',
        'items.food.foodOptions.option.values',
      ],
      order: { ordering: 'ASC', id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = ComboGroupMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<ComboGroupDto> {
    const group = await this.comboGroupRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: [
        'combo',
        'items',
        'items.food',
        'items.food.category',
        'items.food.foodTags.tag',
        'items.food.foodOptions.option',
        'items.food.foodOptions.option.values',
      ],
    });
    if (!group) {
      throw new NotFoundException(`Combo Group not found.`, ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND);
    }
    return ComboGroupMapper.toResponse(group);
  }

  async update(dto: UpdateComboGroupDto): Promise<void> {
    const entity = await this.comboGroupRepo.findOne({
      where: { id: dto.id },
      relations: ['combo'],
    });

    if (!entity) {
      throw new NotFoundException('Combo Group not found', ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND);
    }

    const updatedEntity = ComboGroupMapper.toEntityFromUpdate(entity, dto);

    await this.comboGroupRepo.save(updatedEntity);
  }

  async updateSort(data: ComboGroupSortItemDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of data) {
        await queryRunner.manager.update(ComboGroup, item.id, { ordering: item.ordering });
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Update Combo Group Sort Error:', error);
      throw new BadRequestException(
        'Failed to update combo group ordering',
        ErrorCode.COMBO_GROUP_ERROR_UPDATE_FAILED,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.comboGroupRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Combo Group not found', ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND);
    }
  }
}
