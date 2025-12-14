import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ComboGroupQueryDto } from '../dtos/combo-group.query.dto';
import { ComboGroup } from '../entities/combo-group.entity';

export class ComboGroupSpecification extends BaseSpecification<ComboGroup> {
  private readonly query: ComboGroupQueryDto;

  constructor(query: ComboGroupQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<ComboGroup> {
    const where: FindOptionsWhere<ComboGroup> = {};
    const { comboId, name, status } = this.query;

    if (comboId) {
      where.combo = { id: comboId };
    }

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
