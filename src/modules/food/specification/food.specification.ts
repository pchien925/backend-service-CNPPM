import { BaseSpecification } from 'src/shared/specification/base.specification';
import { And, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FoodQueryDto } from '../dtos/food-query.dto';
import { Food } from '../entities/food.entity';

export class FoodSpecification extends BaseSpecification<Food> {
  private readonly query: FoodQueryDto;

  constructor(query: FoodQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Food> {
    const where: FindOptionsWhere<Food> = {};
    const { name, categoryId, status, minPrice, maxPrice } = this.query;

    // Lọc theo tên
    if (name) {
      where.name = ILike(`%${name}%`);
    }

    // Lọc theo Category ID (Sử dụng quan hệ)
    if (categoryId) {
      // Giả sử Food entity có mối quan hệ Category
      (where as any).category = { id: categoryId };
    }

    // Lọc theo Status (Mặc định là ACTIVE nếu không truyền)
    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = 1; // STATUS_ACTIVE
    }
    const hasValidMinPrice = minPrice !== undefined && !isNaN(minPrice);
    const hasValidMaxPrice = maxPrice !== undefined && !isNaN(maxPrice);

    if (hasValidMinPrice && hasValidMaxPrice) {
      where.basePrice = And(MoreThanOrEqual(minPrice), LessThanOrEqual(maxPrice));
    } else if (hasValidMinPrice) {
      where.basePrice = MoreThanOrEqual(minPrice);
    } else if (hasValidMaxPrice) {
      where.basePrice = LessThanOrEqual(maxPrice);
    }

    return where;
  }
}
