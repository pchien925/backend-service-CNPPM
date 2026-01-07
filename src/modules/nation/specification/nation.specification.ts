import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification'; // Giả định BaseSpecification tồn tại
import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import { NationQueryDto } from '../dtos/nation-query.dto';
import { Nation } from '../entities/nation.entity';

export class NationSpecification extends BaseSpecification<Nation> {
  private readonly query: NationQueryDto;

  constructor(query: NationQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Nation> {
    const where: FindOptionsWhere<Nation> = {};
    const { parentId, name, kind, status } = this.query;

    // Filter by parent ID
    if (parentId !== undefined) {
      if (parentId === '' || parentId === null) {
        where.parent = IsNull();
      } else {
        where.parent = { id: parentId };
      }
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
