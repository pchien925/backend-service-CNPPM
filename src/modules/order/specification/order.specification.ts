import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderQueryDto } from '../dtos/order-query.dto';

export class OrderSpecification extends BaseSpecification<Order> {
  constructor(private readonly query: OrderQueryDto) {
    super();
  }

  public toWhere(): FindOptionsWhere<Order> {
    const where: FindOptionsWhere<Order> = {};
    const { code, orderStatus, branchId, fromDate, toDate } = this.query;

    if (code) {
      where.code = ILike(`%${code}%`);
    }

    if (orderStatus !== undefined) {
      where.orderStatus = orderStatus;
    }

    if (branchId) {
      where.branch = { id: branchId };
    }

    if (fromDate && toDate) {
      where.createdDate = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.createdDate = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.createdDate = LessThanOrEqual(new Date(toDate));
    }

    return where;
  }
}
