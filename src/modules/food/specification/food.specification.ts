import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { FoodQueryDto } from '../dtos/food-query.dto';
import { Food } from '../entities/food.entity';
import { STATUS_ACTIVE } from 'src/constants/app.constant';

export class FoodSpecification extends BaseSpecification<Food> {
  private readonly query: FoodQueryDto;

  constructor(query: FoodQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Food> {
    const where: FindOptionsWhere<Food> = {};
    const { name, categoryId, status, minCookingTime, minPrice, maxPrice } = this.query;

    // Filter by name (Fuzzy search)
    if (name) {
      where.name = ILike(`%${name}%`);
    }

    // Filter by category ID
    if (categoryId !== undefined) {
      where.category = { id: categoryId };
    }

    if (minCookingTime !== undefined) {
      where.cookingTime = MoreThanOrEqual(minCookingTime);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.basePrice = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.basePrice = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.basePrice = LessThanOrEqual(maxPrice);
    }

    // Filter by status
    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = STATUS_ACTIVE;
    }
    return where;
  }
}
