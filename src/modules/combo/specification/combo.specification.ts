import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { And, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ComboQueryDto } from '../dtos/combo-query.dto';
import { Combo } from '../entities/combo.entity';

export class ComboSpecification extends BaseSpecification<Combo> {
  private readonly query: ComboQueryDto;

  constructor(query: ComboQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Combo> {
    const where: FindOptionsWhere<Combo> = {};
    const { categoryId, name, status, minPrice, maxPrice, tagId } = this.query;

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    // Filter by category ID
    if (categoryId) {
      where.category = { id: categoryId };
    }

    // Filter by status, default to ACTIVE
    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = STATUS_ACTIVE;
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

    if (tagId) {
      where.comboTags = {
        tag: {
          id: tagId,
        },
      };
    }

    return where;
  }
}
