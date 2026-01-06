import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike } from 'typeorm';
import { BranchQueryDto } from '../dtos/branch-query.dto';
import { Branch } from '../entities/branch.entity';

export class BranchSpecification extends BaseSpecification<Branch> {
  constructor(private readonly query: BranchQueryDto) {
    super();
  }

  public toWhere(): FindOptionsWhere<Branch> {
    const where: FindOptionsWhere<Branch> = {};
    const { name, status } = this.query;

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = 1; // STATUS_ACTIVE
    }

    return where;
  }
}
