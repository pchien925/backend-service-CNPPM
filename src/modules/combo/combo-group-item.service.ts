import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { Food } from 'src/modules/food/entities/food.entity';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { DataSource, Repository } from 'typeorm';
import { ComboGroupItemMapper } from './combo-group-item.mapper';
import { ComboGroupItemSortDto } from './dtos/combo-group-item-sort.dto';
import { ComboGroupItemQueryDto } from './dtos/combo-group-item.query.dto';
import { CreateComboGroupItemDto } from './dtos/create-combo-group-item.dto';
import { UpdateComboGroupItemDto } from './dtos/update-combo-group-item.dto';
import { ComboGroupItem } from './entities/combo-group-item.entity';
import { ComboGroup } from './entities/combo-group.entity';
import { ComboGroupItemSpecification } from './specification/combo-group-item.specification';

@Injectable()
export class ComboGroupItemService {
  constructor(
    @InjectRepository(ComboGroupItem)
    private readonly itemRepo: Repository<ComboGroupItem>,
    @InjectRepository(ComboGroup)
    private readonly groupRepo: Repository<ComboGroup>,
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateComboGroupItemDto): Promise<void> {
    const group = await this.groupRepo.findOneBy({ id: dto.comboGroupId });
    if (!group) {
      throw new NotFoundException('Combo Group not found', ErrorCode.COMBO_GROUP_ERROR_NOT_FOUND);
    }

    const food = await this.foodRepo.findOneBy({ id: dto.foodId });
    if (!food) {
      throw new NotFoundException('Food not found', ErrorCode.FOOD_ERROR_NOT_FOUND);
    }

    const entity = ComboGroupItemMapper.toEntityFromCreate(dto);
    entity.comboGroup = group;
    entity.food = food;

    await this.itemRepo.save(entity);
  }
  async findAll(query: ComboGroupItemQueryDto): Promise<ResponseListDto<any[]>> {
    const { page = 0, limit = 10 } = query;
    const filterSpec = new ComboGroupItemSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.itemRepo.findAndCount({
      where,
      relations: ['food', 'food.category', 'food.foodTags.tag'],
      order: { ordering: 'ASC', id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = ComboGroupItemMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }
  async delete(id: string): Promise<void> {
    const result = await this.itemRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Item not found', ErrorCode.COMBO_GROUP_ITEM_ERROR_NOT_FOUND);
    }
  }

  async update(dto: UpdateComboGroupItemDto): Promise<void> {
    const item = await this.itemRepo.findOneBy({ id: dto.id });
    if (!item) {
      throw new NotFoundException('Item not found', ErrorCode.COMBO_GROUP_ITEM_ERROR_NOT_FOUND);
    }

    const updateData: any = {};
    if (dto.extraPrice !== undefined) updateData.extraPrice = dto.extraPrice;
    if (dto.ordering !== undefined) updateData.ordering = dto.ordering;

    await this.itemRepo.update(dto.id, updateData);
  }

  async updateSort(data: ComboGroupItemSortDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of data) {
        await queryRunner.manager.update(
          ComboGroupItem,
          { id: item.id },
          { ordering: item.ordering },
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Update Combo Group Item Sort Error:', error);
      throw new BadRequestException(
        'Update item sort failed',
        ErrorCode.COMBO_GROUP_ITEM_ERROR_UPDATE_FAILED,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
