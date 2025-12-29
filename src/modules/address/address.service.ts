import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NATION_KIND_DISTRICT,
  NATION_KIND_PROVINCE,
  NATION_KIND_WARD,
  STATUS_ACTIVE,
  STATUS_DELETE,
} from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { Not, Repository } from 'typeorm';
import { Nation } from '../nation/entities/nation.entity';
import { AddressMapper } from './address.mapper';
import { AddressQueryDto } from './dtos/address-query.dto';
import { AddressDto } from './dtos/address.dto';
import { CreateAddressDto } from './dtos/create-address.dto';
import { Address } from './entities/address.entity';
import { AddressSpecification } from './specification/address.specification';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(Nation)
    private readonly nationRepo: Repository<Nation>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  private async getAndValidateNations(pId: string, dId: string, wId: string) {
    const province = await this.nationRepo.findOneBy({
      id: pId,
      kind: NATION_KIND_PROVINCE,
      status: STATUS_ACTIVE,
    });
    if (!province) {
      throw new NotFoundException(
        'Province not found or inactive',
        ErrorCode.NATION_ERROR_NOT_FOUND,
      );
    }

    const district = await this.nationRepo.findOne({
      where: { id: dId, kind: NATION_KIND_DISTRICT, status: STATUS_ACTIVE },
      relations: ['parent'],
    });
    if (!district || district.parent?.id !== pId) {
      throw new BadRequestException(
        'Invalid District or Province hierarchy',
        ErrorCode.ADDRESS_ERROR_INVALID_NATION,
      );
    }

    const ward = await this.nationRepo.findOne({
      where: { id: wId, kind: NATION_KIND_WARD, status: STATUS_ACTIVE },
      relations: ['parent'],
    });
    if (!ward || ward.parent?.id !== dId) {
      throw new BadRequestException(
        'Invalid Ward or District hierarchy',
        ErrorCode.ADDRESS_ERROR_INVALID_NATION,
      );
    }

    return { province, district, ward };
  }

  private async resetDefaultAddress(accountId: string): Promise<void> {
    await this.addressRepo.update(
      { account: { id: accountId }, isDefault: true },
      { isDefault: false },
    );
  }

  async create(dto: CreateAddressDto): Promise<void> {
    const account = await this.accountRepo.findOneBy({ id: dto.accountId });
    if (!account) {
      throw new NotFoundException(`Account not found`, ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
    }

    const { province, district, ward } = await this.getAndValidateNations(
      dto.provinceId,
      dto.districtId,
      dto.wardId,
    );

    const entity = AddressMapper.toEntityFromCreate(dto);

    entity.account = account;
    entity.province = province;
    entity.district = district;
    entity.ward = ward;

    if (entity.isDefault) {
      await this.resetDefaultAddress(dto.accountId);
    }

    await this.addressRepo.save(entity);
  }

  async findAll(query: AddressQueryDto): Promise<ResponseListDto<AddressDto[]>> {
    const { page = 0, limit = 10 } = query;

    const filterSpec = new AddressSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.addressRepo.findAndCount({
      where,
      relations: ['account', 'province', 'district', 'ward'],
      order: { isDefault: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    const content = AddressMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async autoComplete(query: AddressQueryDto): Promise<ResponseListDto<AddressDto[]>> {
    const { page = 0, limit = 10 } = query;

    const filterSpec = new AddressSpecification(query);
    const where = filterSpec.toWhere();

    where.status = STATUS_ACTIVE;

    const [entities, totalElements] = await this.addressRepo.findAndCount({
      where,
      relations: ['account', 'province', 'district', 'ward'],
      order: { isDefault: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    const content = AddressMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<AddressDto> {
    const entity = await this.addressRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['province', 'district', 'ward'],
    });

    if (!entity) {
      throw new NotFoundException('Address not found', ErrorCode.ADDRESS_ERROR_NOT_FOUND);
    }

    return AddressMapper.toResponse(entity);
  }

  async update(dto: UpdateAddressDto): Promise<void> {
    const { id, provinceId, districtId, wardId, isDefault } = dto;

    const entity = await this.addressRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['account', 'province', 'district', 'ward'],
    });

    if (!entity) {
      throw new NotFoundException('Address not found', ErrorCode.ADDRESS_ERROR_NOT_FOUND);
    }

    if (provinceId || districtId || wardId) {
      const pId = provinceId ?? entity.province.id;
      const dId = districtId ?? entity.district.id;
      const wId = wardId ?? entity.ward.id;

      const nations = await this.getAndValidateNations(pId, dId, wId);
      entity.province = nations.province;
      entity.district = nations.district;
      entity.ward = nations.ward;
    }

    if (isDefault === true && !entity.isDefault) {
      await this.resetDefaultAddress(entity.account.id);
    }

    const updatedEntity = AddressMapper.toEntityFromUpdate(entity, dto);
    await this.addressRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.addressRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
    });

    if (!entity) {
      throw new NotFoundException('Address not found', ErrorCode.ADDRESS_ERROR_NOT_FOUND);
    }

    if (entity.isDefault) {
      throw new BadRequestException(
        'Cannot delete default address',
        ErrorCode.ADDRESS_ERROR_DELETE_DEFAULT,
      );
    }

    entity.status = STATUS_DELETE;
    await this.addressRepo.save(entity);
  }
}
