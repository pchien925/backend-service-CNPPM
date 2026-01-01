import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { NotFoundException } from 'src/exception/not-found.exception';
import { DataSource, Repository } from 'typeorm';
import { CreateFoodOptionDto } from './dtos/create-food-optiondto';
import { UpdateFoodOptionDto } from './dtos/update-food-optiondto';
import { FoodOption } from './entities/food-option.entity';
import { Food } from './entities/food.entity';
import { FoodOptionMapper } from './food-option.mapper';
import { FoodOptionQueryDto } from './dtos/food-option-query.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { FoodOptionSpecification } from './specification/food-option.specification';
import { Option } from '../option/entities/option.entity';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { FoodOptionSortItemDto } from './dtos/food-option-sort.dto';

@Injectable()
export class FoodOptionService {
  constructor(
    @InjectRepository(FoodOption)
    private readonly foodOptionRepo: Repository<FoodOption>,
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateFoodOptionDto): Promise<void> {
    const food = await this.foodRepo.findOneBy({ id: dto.foodId, status: STATUS_ACTIVE });
    if (!food) throw new NotFoundException('Food not found', ErrorCode.FOOD_ERROR_NOT_FOUND);

    const option = await this.optionRepo.findOneBy({ id: dto.optionId });
    if (!option) throw new NotFoundException('Option not found', ErrorCode.OPTION_ERROR_NOT_FOUND);

    const entity = FoodOptionMapper.toEntityFromCreate(dto);
    entity.food = food;
    entity.option = option;

    await this.foodOptionRepo.save(entity);
  }

  async update(dto: UpdateFoodOptionDto): Promise<void> {
    const entity = await this.foodOptionRepo.findOneBy({ id: dto.id });
    if (!entity) {
      throw new NotFoundException('Food Option link not found', ErrorCode.FOOD_OPTION_NOT_FOUND);
    }

    const updatedEntity = FoodOptionMapper.toEntityFromUpdate(entity, dto);

    await this.foodOptionRepo.save(updatedEntity);
  }
  async updateSort(data: FoodOptionSortItemDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Thực hiện cập nhật đồng thời các bản ghi
      await Promise.all(
        data.map(item =>
          queryRunner.manager.update(FoodOption, { id: item.id }, { ordering: item.ordering }),
        ),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Update Food Option Sort Error:', error);
      throw new BadRequestException(
        'Failed to update food option ordering',
        ErrorCode.FOOD_OPTION_ERROR_UPDATE_FAILED,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: FoodOptionQueryDto): Promise<ResponseListDto<any[]>> {
    const { page = 0, limit = 10 } = query;
    const filterSpec = new FoodOptionSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.foodOptionRepo.findAndCount({
      where,
      relations: ['food', 'option'],
      order: { ordering: 'ASC', id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = FoodOptionMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<any> {
    const entity = await this.foodOptionRepo.findOne({
      where: { id },
      relations: ['food', 'option'],
    });
    if (!entity) throw new NotFoundException('Food Option link not found');
    return FoodOptionMapper.toResponse(entity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.foodOptionRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Food Option link not found');
  }
}
