import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere } from 'typeorm';
import { FoodOptionQueryDto } from '../dtos/food-option-query.dto';
import { FoodOption } from '../entities/food-option.entity';

export class FoodOptionSpecification extends BaseSpecification<FoodOption> {
  constructor(private readonly query: FoodOptionQueryDto) {
    super();
  }

  public toWhere(): FindOptionsWhere<FoodOption> {
    const where: FindOptionsWhere<FoodOption> = {};
    const { foodId, optionId } = this.query;

    if (foodId) {
      where.food = { id: foodId };
    }

    if (optionId) {
      where.option = { id: optionId };
    }

    return where;
  }
}
