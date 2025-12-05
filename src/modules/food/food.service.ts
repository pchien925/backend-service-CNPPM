import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Food } from './entities/food.entity';
import { FoodTag } from './entities/food-tag.entity';
import { FoodOption } from './entities/food-option.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Option } from 'src/modules/option/entities/option.entity';
import { CreateFoodDto } from './dtos/create-food.dto';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { FoodDto } from './dtos/food.dto';
import { FoodMapper } from './food.mapper';
import { NotFoundException } from 'src/exception/not-found.exception';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { FoodOptionPayloadDto } from './dtos/food-option-payload.dto';

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

  // ==================== CREATE ====================
  async create(dto: CreateFoodDto): Promise<void> {
    const { categoryId, tagIds, options, ...foodData } = dto;

    // 1. Kiểm tra Category
    const category = await this.categoryRepo.findOneBy({
      id: categoryId,
      status: STATUS_ACTIVE,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    // 2. Tạo Food Entity
    const foodEntity = FoodMapper.toEntityFromCreate(foodData);
    foodEntity.category = category;
    const savedFood = await this.foodRepo.save(foodEntity);

    // 3. Xử lý FoodTags (Mối quan hệ N-N với Tag)
    if (tagIds && tagIds.length > 0) {
      await this.syncFoodTags(savedFood, tagIds);
    }

    // 4. Xử lý FoodOptions (Mối quan hệ N-N với Option kèm theo thuộc tính)
    if (options && options.length > 0) {
      await this.syncFoodOptions(savedFood, options);
    }
  }

  // ==================== READ ====================
  async findOne(id: number): Promise<FoodDto> {
    const food = await this.foodRepo.findOne({
      where: { id, status: In([STATUS_ACTIVE]) },
      // Đảm bảo tải Category, Tag và Option để ánh xạ chi tiết
      relations: ['category', 'foodTags.tag', 'foodOptions.option'],
    });

    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found.`);
    }

    return FoodMapper.toResponse(food);
  }

  // ==================== UPDATE ====================
  async update(dto: UpdateFoodDto): Promise<void> {
    const { id, tagIds, options, categoryId, ...updateData } = dto;

    // Tải Food kèm theo các quan hệ hiện tại để đồng bộ hóa
    const foodEntity = await this.foodRepo.findOne({
      where: { id, status: In([STATUS_ACTIVE]) },
      relations: ['category', 'foodTags.tag', 'foodOptions.option'],
    });

    if (!foodEntity) {
      throw new NotFoundException(`Food with ID ${id} not found.`);
    }

    let category: Category | undefined;
    if (categoryId !== undefined) {
      category = await this.categoryRepo.findOneBy({ id: categoryId, status: STATUS_ACTIVE });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found.`);
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
      await this.syncFoodTags(savedFood, tagIds);
    }

    // 3. Cập nhật FoodOptions (Đồng bộ hóa)
    if (options !== undefined) {
      await this.syncFoodOptions(savedFood, options);
    }
  }

  // ==================== DELETE ====================
  async delete(id: number): Promise<void> {
    // Soft Delete
    const result = await this.foodRepo.update({ id }, { status: STATUS_DELETE });

    if (result.affected === 0) {
      throw new NotFoundException(`Food with ID ${id} not found.`);
    }
  }

  // ==================== LOGIC ĐỒNG BỘ HÓA ====================

  /**
   * Đồng bộ hóa FoodTags: Thêm mới các Tag ID chưa có, Xóa các Tag ID đã bị loại bỏ.
   */
  private async syncFoodTags(food: Food, newTagIds: number[]): Promise<void> {
    // Lấy Tag ID hiện tại từ FoodTags đã được tải (food.foodTags)
    const currentFoodTags = food.foodTags || [];
    const currentTagIds = currentFoodTags.map(ft => ft.tag.id);

    // Tags cần xóa: Có trong hiện tại, nhưng không có trong mới
    const tagsToDelete = currentFoodTags.filter(ft => !newTagIds.includes(ft.tag.id));

    // Tags cần thêm: Có trong mới, nhưng không có trong hiện tại
    const tagIdsToAdd = newTagIds.filter(newId => !currentTagIds.includes(newId));

    if (tagsToDelete.length > 0) {
      const foodTagIdsToDelete = tagsToDelete.map(ft => ft.id);
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
    const optionIdsMap = new Map<number, FoodOption>();
    currentFoodOptions.forEach(fo => optionIdsMap.set(fo.option.id, fo));

    const optionsToSave: FoodOption[] = [];
    const foodOptionIdsToDelete: number[] = currentFoodOptions.map(fo => fo.id);

    if (!newOptions || newOptions.length === 0) {
      // Nếu không có Options mới, xóa tất cả
      await this.foodOptionRepo.delete(foodOptionIdsToDelete);
      return;
    }

    // Duyệt qua Options mới:
    for (const newOpt of newOptions) {
      const currentFo = optionIdsMap.get(newOpt.optionId);

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
        // Chưa tồn tại: CREATE
        const option = await this.optionRepo.findOneBy({
          id: newOpt.optionId,
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

    // Xóa các bản ghi FoodOption không còn trong danh sách mới
    if (foodOptionIdsToDelete.length > 0) {
      await this.foodOptionRepo.delete(foodOptionIdsToDelete);
    }

    // Lưu các bản ghi mới hoặc đã cập nhật
    if (optionsToSave.length > 0) {
      await this.foodOptionRepo.save(optionsToSave);
    }
  }
}
