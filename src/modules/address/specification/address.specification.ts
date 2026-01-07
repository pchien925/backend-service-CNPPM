import { STATUS_ACTIVE } from 'src/constants/app.constant';
import { BaseSpecification } from 'src/shared/specification/base.specification';
import { FindOptionsWhere } from 'typeorm';
import { AddressQueryDto } from '../dtos/address-query.dto';
import { Address } from '../entities/address.entity';

export class AddressSpecification extends BaseSpecification<Address> {
  private readonly query: AddressQueryDto;

  constructor(query: AddressQueryDto) {
    super();
    this.query = query;
  }

  public toWhere(): FindOptionsWhere<Address> {
    const where: FindOptionsWhere<Address> = {};
    const { accountId, provinceId, districtId, wardId, isDefault, status } = this.query;

    where.account = { id: accountId };

    if (provinceId) {
      where.province = { id: provinceId };
    }

    if (districtId) {
      where.district = { id: districtId };
    }

    if (wardId) {
      where.ward = { id: wardId };
    }

    if (isDefault !== undefined) {
      where.isDefault = isDefault;
    }

    if (status !== undefined) {
      where.status = status;
    } else {
      where.status = STATUS_ACTIVE;
    }

    return where;
  }
}
