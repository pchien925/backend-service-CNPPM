import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike } from 'typeorm';
import { TagQueryDto } from '../dtos/tag-query.dto';
import { Tag } from '../entities/tag.entity';

export class TagSpecification extends BaseSpecification<Tag> {
  private readonly query: TagQueryDto;

  constructor(query: TagQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Tag> {
    const where: FindOptionsWhere<Tag> = {};
    const { name, status } = this.query;

    // Filter by name
    if (name) {
      where.name = ILike(`%${name}%`);
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = 1;
    }

    return where;
  }
}
