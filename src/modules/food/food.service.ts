import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { In, Not, Repository } from 'typeorm';
import { CreateFoodDto } from './dtos/create-food.dto';
import { FoodQueryDto } from './dtos/food-query.dto';
import { FoodDto } from './dtos/food.dto';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { FoodTag } from './entities/food-tag.entity';
import { Food } from './entities/food.entity';
import { FoodMapper } from './food.mapper';
import { FoodSpecification } from './specification/food.specification';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(FoodTag)
    private readonly foodTagRepo: Repository<FoodTag>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateFoodDto): Promise<void> {
    const { categoryId, tagIds, ...foodData } = dto;

    this.validateDuplicateTagIds(tagIds);

    const category = await this.categoryRepo.findOneBy({
      id: categoryId,
      status: STATUS_ACTIVE,
    });
    if (!category) {
      throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
    }

    const foodEntity = FoodMapper.toEntityFromCreate(foodData);
    foodEntity.category = category;
    const savedFood = await this.foodRepo.save(foodEntity);

    if (tagIds && tagIds.length > 0) {
      await this.syncFoodTags(savedFood, tagIds);
    }
  }

  async findOne(id: string): Promise<FoodDto> {
    const food = await this.foodRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['category', 'foodTags.tag', 'foodOptions.option'],
    });

    if (!food) {
      throw new NotFoundException(`Food not found.`, ErrorCode.FOOD_ERROR_NOT_FOUND);
    }

    return FoodMapper.toResponse(food);
  }

  async update(dto: UpdateFoodDto): Promise<void> {
    const { id, tagIds, categoryId, ...updateData } = dto;

    this.validateDuplicateTagIds(tagIds);

    const foodEntity = await this.foodRepo.findOne({
      where: { id, status: In([STATUS_ACTIVE]) },
      relations: ['category', 'foodTags.tag'],
    });

    if (!foodEntity) {
      throw new NotFoundException(`Food not found.`, ErrorCode.FOOD_ERROR_NOT_FOUND);
    }

    let category: Category | undefined;
    if (categoryId !== undefined) {
      category = await this.categoryRepo.findOneBy({ id: categoryId, status: STATUS_ACTIVE });
      if (!category) {
        throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
      }
    }

    const updatedFood = FoodMapper.toEntityFromUpdate(foodEntity, updateData);
    if (category) {
      updatedFood.category = category;
    }
    const savedFood = await this.foodRepo.save(updatedFood);

    if (tagIds !== undefined) {
      await this.syncFoodTags(savedFood, tagIds);
    }
  }

  async findAll(query: FoodQueryDto): Promise<ResponseListDto<FoodDto[]>> {
    const { page = 0, limit = 10 } = query;
    const filterSpec = new FoodSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.foodRepo.findAndCount({
      where,
      relations: ['category', 'foodTags.tag'],
      order: { id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = FoodMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async autoComplete(query: FoodQueryDto): Promise<ResponseListDto<FoodDto[]>> {
    const { page = 0, limit = 10 } = query;
    const filterSpec = new FoodSpecification(query);
    const where = filterSpec.toWhere();
    where.status = STATUS_ACTIVE;

    const [entities, totalElements] = await this.foodRepo.findAndCount({
      where,
      order: { id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = FoodMapper.toAutoCompleteResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async delete(id: string): Promise<void> {
    const result = await this.foodRepo.update({ id }, { status: STATUS_DELETE });
    if (result.affected === 0) {
      throw new NotFoundException(`Food not found.`, ErrorCode.FOOD_ERROR_NOT_FOUND);
    }
  }
  private validateDuplicateTagIds(tagIds: string[] | undefined): void {
    if (tagIds && tagIds.length > 0) {
      const uniqueTagIds = new Set(tagIds);
      if (uniqueTagIds.size !== tagIds.length) {
        throw new BadRequestException(
          'Duplicate Tag IDs found in the request.',
          ErrorCode.FOOD_ERROR_TAG_DUPLICATE,
        );
      }
    }
  }
  private async syncFoodTags(food: Food, newTagIds: string[]): Promise<void> {
    const currentFoodTags = food.foodTags || [];
    const currentTagIds = currentFoodTags.map(ft => ft.tag.id);

    const deleteIds = currentFoodTags.filter(ft => !newTagIds.includes(ft.tag.id)).map(ft => ft.id);

    const addIds = newTagIds.filter(id => !currentTagIds.includes(id));

    if (deleteIds.length > 0) await this.foodTagRepo.delete(deleteIds);

    if (addIds.length > 0) {
      const tags = await this.tagRepo.findBy({ id: In(addIds), status: STATUS_ACTIVE });
      const newEntities = tags.map(tag => ({ food, tag }));
      await this.foodTagRepo.save(newEntities);
    }
  }
}
