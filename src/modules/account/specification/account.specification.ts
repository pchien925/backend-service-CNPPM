import { STATUS_DELETE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { AccountQueryDto } from '../dtos/account-query.dto';
import { Account } from '../entities/account.entity';

export class AccountSpecification extends BaseSpecification<Account> {
  constructor(private readonly query: AccountQueryDto) {
    super();
  }

  public toWhere(): FindOptionsWhere<Account> {
    const { username, email, phone, fullName, groupId, kind, status } = this.query;
    const where: FindOptionsWhere<Account> = {};

    if (username) {
      where.username = ILike(`%${username.trim()}%`);
    }

    if (email) {
      where.email = ILike(`%${email.trim()}%`);
    }

    if (phone) {
      where.phone = ILike(`%${phone.trim()}%`);
    }

    if (fullName) {
      where.fullName = ILike(`%${fullName.trim()}%`);
    }

    if (groupId) {
      where.group = { id: groupId };
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
