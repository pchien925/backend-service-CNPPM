import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike } from 'typeorm';
import { OptionQueryDto } from '../dtos/option-query.dto';
import { Option } from '../entities/option.entity';

export class OptionSpecification extends BaseSpecification<Option> {
  constructor(private readonly query: OptionQueryDto) {
    super();
  }

  public toWhere(): FindOptionsWhere<Option> {
    const { name, status } = this.query;
    const where: FindOptionsWhere<Option> = {};

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = STATUS_ACTIVE;
    }

    return where;
  }
}
