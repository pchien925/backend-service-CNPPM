import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { Category } from 'src/modules/category/entities/category.entity';
import { Option } from 'src/modules/option/entities/option.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateFoodDto } from './dtos/create-food.dto';
import { FoodOptionPayloadDto } from './dtos/food-option-payload.dto';
import { FoodQueryDto } from './dtos/food-query.dto';
import { FoodDto } from './dtos/food.dto';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { FoodOption } from './entities/food-option.entity';
import { FoodTag } from './entities/food-tag.entity';
import { Food } from './entities/food.entity';
import { FoodMapper } from './food.mapper';
import { FoodSpecification } from './specification/food.specification';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(FoodTag)
    private readonly foodTagRepo: Repository<FoodTag>,
    @InjectRepository(FoodOption)
    private readonly foodOptionRepo: Repository<FoodOption>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async create(dto: CreateFoodDto): Promise<void> {
    const { categoryId, tagIds, options, ...foodData } = dto;

    // 0. validate
    this.validateDuplicateIds(tagIds, options);
    // 1. Kiểm tra Category
    const category = await this.categoryRepo.findOneBy({
      id: categoryId,
      status: STATUS_ACTIVE,
    });
    if (!category) {
      throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
    }

    // 2. Tạo Food Entity
    const foodEntity = FoodMapper.toEntityFromCreate(foodData);
    foodEntity.category = category;
    const savedFood = await this.foodRepo.save(foodEntity);

    // 3. Xử lý FoodTags (Mối quan hệ N-N với Tag)
    if (tagIds && tagIds.length > 0) {
      await this.syncFoodTags(savedFood, tagIds as string[]);
    }

    if (options && options.length > 0) {
      await this.syncFoodOptions(savedFood, options);
    }
  }

  async findOne(id: string): Promise<FoodDto> {
    const food = await this.foodRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['category', 'foodTags.tag', 'foodOptions.option', 'foodOptions.option.values'],
    });

    if (!food) {
      throw new NotFoundException(`Food not found.`, ErrorCode.FOOD_ERROR_NOT_FOUND);
    }

    return FoodMapper.toResponse(food);
  }

  async update(dto: UpdateFoodDto): Promise<void> {
    const { id, tagIds, options, categoryId, ...updateData } = dto;

    // 0. validate
    this.validateDuplicateIds(tagIds, options);
    const foodEntity = await this.foodRepo.findOne({
      where: { id, status: In([STATUS_ACTIVE]) },
      relations: ['category', 'foodTags.tag', 'foodOptions.option'],
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

    // 1. Cập nhật Food chính
    const updatedFood = FoodMapper.toEntityFromUpdate(foodEntity, updateData);
    if (category) {
      updatedFood.category = category;
    }
    const savedFood = await this.foodRepo.save(updatedFood);

    // 2. Cập nhật FoodTags (Đồng bộ hóa)
    if (tagIds !== undefined) {
      await this.syncFoodTags(savedFood, tagIds as string[]);
    }

    // 3. Cập nhật FoodOptions (Đồng bộ hóa)
    if (options !== undefined) {
      await this.syncFoodOptions(savedFood, options);
    }
  }

  async findAll(query: FoodQueryDto): Promise<ResponseListDto<FoodDto[]>> {
    const { page = 0, limit = 10 } = query;

    const filterSpec = new FoodSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.foodRepo.findAndCount({
      where,
      relations: ['category', 'foodTags.tag', 'foodOptions'],
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

  // ==================== Hàm kiểm tra trùng lặp ID ====================
  private validateDuplicateIds(
    tagIds: string[] | undefined,
    options: FoodOptionPayloadDto[] | undefined,
  ): void {
    if (tagIds && tagIds.length > 0) {
      const uniqueTagIds = new Set(tagIds);
      if (uniqueTagIds.size !== tagIds.length) {
        throw new BadRequestException(
          'Duplicate Tag IDs found in the request.',
          ErrorCode.FOOD_ERROR_TAG_DUPLICATE,
        );
      }
    }

    if (options && options.length > 0) {
      const optionIds = options.map(opt => opt.id); // option.id (string)
      const uniqueOptionIds = new Set(optionIds);
      if (uniqueOptionIds.size !== optionIds.length) {
        throw new BadRequestException(
          'Duplicate Option IDs found in the request.',
          ErrorCode.FOOD_ERROR_OPTION_DUPLICATE,
        );
      }
    }
  }
  // ==================== LOGIC ĐỒNG BỘ HÓA ====================
  /**
   * Đồng bộ hóa FoodTags: Thêm mới các Tag ID chưa có, Xóa các Tag ID đã bị loại bỏ.
   */
  private async syncFoodTags(food: Food, newTagIds: string[]): Promise<void> {
    // Lấy Tag ID hiện tại từ FoodTags đã được tải (food.foodTags)
    const currentFoodTags = food.foodTags || [];
    const currentTagIds = currentFoodTags.map(ft => ft.tag.id);

    // Tags cần xóa: Có trong hiện tại, nhưng không có trong mới
    const tagsToDelete = currentFoodTags.filter(ft => !newTagIds.includes(ft.tag.id));

    // Tags cần thêm: Có trong mới, nhưng không có trong hiện tại
    const tagIdsToAdd = newTagIds.filter(newId => !currentTagIds.includes(newId));

    if (tagsToDelete.length > 0) {
      const foodTagIdsToDelete: string[] = tagsToDelete.map(ft => ft.id);
      await this.foodTagRepo.delete(foodTagIdsToDelete);
    }

    if (tagIdsToAdd.length > 0) {
      const tags = await this.tagRepo.findBy({ id: In(tagIdsToAdd), status: STATUS_ACTIVE });
      const newFoodTags = tags.map(tag => {
        const foodTag = new FoodTag();
        foodTag.food = food;
        foodTag.tag = tag;
        return foodTag;
      });
      await this.foodTagRepo.save(newFoodTags);
    }
  }

  /**
   * Đồng bộ hóa FoodOptions: Xóa, Thêm mới, hoặc Cập nhật thuộc tính (ordering, maxSelect...).
   */
  private async syncFoodOptions(food: Food, newOptions: FoodOptionPayloadDto[]): Promise<void> {
    const currentFoodOptions = food.foodOptions || [];
    const optionIdsMap = new Map<string, FoodOption>();
    currentFoodOptions.forEach(fo => optionIdsMap.set(fo.option.id, fo));

    const optionsToSave: FoodOption[] = [];
    const foodOptionIdsToDelete: string[] = currentFoodOptions.map(fo => fo.id);

    if (!newOptions || newOptions.length === 0) {
      // Nếu không có Options mới, xóa tất cả
      await this.foodOptionRepo.delete(foodOptionIdsToDelete);
      return;
    }

    // Duyệt qua Options mới:
    for (const newOpt of newOptions) {
      const currentFo = optionIdsMap.get(newOpt.id);

      const newOrdering = newOpt.ordering ?? 0;
      const newRequirementType = newOpt.requirementType ?? 1;
      const newMaxSelect = newOpt.maxSelect ?? 1;

      if (currentFo) {
        // Tồn tại: loại bỏ khỏi danh sách xóa
        const indexToDelete = foodOptionIdsToDelete.indexOf(currentFo.id);
        if (indexToDelete > -1) {
          foodOptionIdsToDelete.splice(indexToDelete, 1);
        }

        // Kiểm tra xem có cần cập nhật thuộc tính không
        const needsUpdate =
          currentFo.ordering !== newOrdering ||
          currentFo.requirementType !== newRequirementType ||
          currentFo.maxSelect !== newMaxSelect;

        if (needsUpdate) {
          currentFo.ordering = newOrdering;
          currentFo.requirementType = newRequirementType;
          currentFo.maxSelect = newMaxSelect;
          optionsToSave.push(currentFo);
        }
      } else {
        const option = await this.optionRepo.findOneBy({
          id: newOpt.id,
          status: STATUS_ACTIVE,
        });
        if (option) {
          const foodOption = new FoodOption();
          foodOption.food = food;
          foodOption.option = option;
          foodOption.ordering = newOrdering;
          foodOption.requirementType = newRequirementType;
          foodOption.maxSelect = newMaxSelect;
          optionsToSave.push(foodOption);
        }
      }
    }

    if (foodOptionIdsToDelete.length > 0) {
      await this.foodOptionRepo.delete(foodOptionIdsToDelete);
    }

    if (optionsToSave.length > 0) {
      await this.foodOptionRepo.save(optionsToSave);
    }
  }
}
