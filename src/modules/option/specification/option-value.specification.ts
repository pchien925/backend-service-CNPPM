import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike } from 'typeorm';
import { OptionValueQueryDto } from '../dtos/option-value-query.dto';
import { OptionValue } from '../entities/option-value.entity';
import { STATUS_ACTIVE } from 'src/constants/app.constant';

export class OptionValueSpecification extends BaseSpecification<OptionValue> {
  private readonly query: OptionValueQueryDto;

  constructor(query: OptionValueQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<OptionValue> {
    const where: FindOptionsWhere<OptionValue> = {};
    const { optionId, name, status } = this.query;

    //filter theo option
    if (optionId) {
      where.option = { id: optionId };
    }

    //ft theo name
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
