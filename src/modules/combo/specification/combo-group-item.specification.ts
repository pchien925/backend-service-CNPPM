import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere } from 'typeorm';
import { ComboGroupItemQueryDto } from '../dtos/combo-group-item.query.dto';
import { ComboGroupItem } from '../entities/combo-group-item.entity';

export class ComboGroupItemSpecification extends BaseSpecification<ComboGroupItem> {
  private readonly query: ComboGroupItemQueryDto;

  constructor(query: ComboGroupItemQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<ComboGroupItem> {
    const { comboGroupId, foodId, status } = this.query;

    const where: FindOptionsWhere<ComboGroupItem> = {
      comboGroup: { id: comboGroupId },
    };

    if (foodId) {
      where.food = { id: foodId };
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = STATUS_ACTIVE;
    }

    return where;
  }
}
