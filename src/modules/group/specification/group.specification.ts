import { STATUS_DELETE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { Group } from '../entities/group.entity';
import { GroupQueryDto } from '../dtos/groups-query.dto';

export class GroupSpecification extends BaseSpecification<Group> {
  constructor(private readonly query: GroupQueryDto) {
    super();
  }

  public toWhere(): FindOptionsWhere<Group> {
    const { name, kind, status } = this.query;
    const where: FindOptionsWhere<Group> = {};

    if (name) {
      where.name = ILike(`%${name.trim()}%`);
    }

    if (kind !== undefined) {
      where.kind = kind;
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = Not(STATUS_DELETE);
    }

    return where;
  }
}
