import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike } from 'typeorm';
import { CategoryQueryDto } from '../dtos/category-query.dto';
import { Category } from '../entities/category.entity';
import { STATUS_ACTIVE } from 'src/constants/app.constant';

export class CategorySpecification extends BaseSpecification<Category> {
  private readonly query: CategoryQueryDto;

  constructor(query: CategoryQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Category> {
    const where: FindOptionsWhere<Category> = {};
    const { parentId, name, kind, status } = this.query;

    // Filter by parent ID
    if (parentId !== undefined || parentId !== null) {
      where.parent = { id: parentId };
    }

    // Filter by name
    if (name) {
      where.name = ILike(`%${name}%`);
    }

    // Filter by kind
    if (kind !== undefined) {
      where.kind = kind;
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = STATUS_ACTIVE;
    }

    return where;
  }
}
