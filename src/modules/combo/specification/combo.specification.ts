import { BaseSpecification } from 'src/shared/specification/base.specification';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Combo } from '../entities/combo.entity';
import { ComboQueryDto } from '../dtos/combo-query.dto';
import { STATUS_ACTIVE } from 'src/constants/app.constant';

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

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.basePrice = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.basePrice = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
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
