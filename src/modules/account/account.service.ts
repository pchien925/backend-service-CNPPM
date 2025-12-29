import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { UnauthorizationException } from 'src/exception/unauthorization.exception';
import { hashPassword, verifyPassword } from 'src/utils';
import { Repository } from 'typeorm';
import { UserDetailsDto } from '../auth/dtos/user-details.dto';
import { Group } from '../group/entities/group.entity';
import { AccountMapper } from './account.mapper';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { Account } from './entities/account.entity';
import { AccountSpecification } from './specification/account.specification';
import { AccountQueryDto } from './dtos/account-query.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
  ) {}

  async findAll(query: AccountQueryDto): Promise<ResponseListDto<AccountDto[]>> {
    const { page = 0, limit = 10 } = query;

    const spec = new AccountSpecification(query);
    const where = spec.toWhere();

    const [entities, totalElements] = await this.accountRepo.findAndCount({
      where,
      relations: ['group'],
      order: { id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = AccountMapper.toResponseList(entities);

    return new ResponseListDto(content, totalElements, limit);
  }

  async getAccountById(id: string): Promise<AccountDto> {
    const account = await this.accountRepo.findOne({
      where: { id: id },
      relations: ['group', 'group.permissions'],
    });

    if (!account) {
      throw new NotFoundException('Account not found', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
    }

    return AccountMapper.toDetailResponse(account);
  }

  async findOne(id: string): Promise<AccountDto> {
    const account = await this.accountRepo.findOne({
      where: { id: id },
      relations: ['group'],
    });

    if (!account) {
      throw new NotFoundException('Account not found', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
    }

    return AccountMapper.toDetailResponse(account);
  }

  async validateCredentials(username: string, password: string): Promise<UserDetailsDto> {
    const account = await this.accountRepo.findOne({
      where: { username, status: STATUS_ACTIVE },
      relations: ['group', 'group.permissions'],
      select: [
        'id',
        'username',
        'email',
        'password',
        'fullName',
        'phone',
        'avatarPath',
        'kind',
        'isSuperAdmin',
      ],
    });
    if (!account) {
      throw new UnauthorizationException('Invalid credentials', ErrorCode.AUTH_ERROR_UNAUTHORIZED);
    }
    const match = await verifyPassword(password, account.password);
    if (!match) {
      throw new UnauthorizationException(
        'Invalid credentials',
        ErrorCode.ACCOUNT_ERROR_INVALID_PASSWORD,
      );
    }

    const authorities = (account.group?.permissions ?? [])
      .map(p => p.permissionCode)
      .filter(Boolean);

    return new UserDetailsDto(
      account.id,
      account.username,
      account.kind,
      authorities,
      account.isSuperAdmin,
    );
  }

  async create(dto: CreateAccountDto): Promise<void> {
    const existUser = await this.accountRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existUser) {
      throw new BadRequestException(
        'Username or email already exists',
        ErrorCode.ACCOUNT_ERROR_USERNAME_EXISTED,
      );
    }

    const account = AccountMapper.toEntityFromCreate(dto);

    const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    account.group = group;

    account.status = STATUS_ACTIVE;
    account.password = await hashPassword(dto.password);

    account.otpCode = null;
    account.otpExpiresAt = null;

    await this.accountRepo.save(account);
  }

  async update(dto: UpdateAccountDto): Promise<void> {
    const account = await this.accountRepo.findOne({
      where: { id: dto.id },
      relations: ['group'],
    });

    if (!account) {
      throw new NotFoundException('Account not found', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
    }

    AccountMapper.toEntityFromUpdate(account, dto);

    if (dto.password) {
      account.password = await hashPassword(dto.password);
    }

    if (dto.groupId) {
      const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
      if (!group) {
        throw new NotFoundException('Group not found', ErrorCode.GROUP_ERROR_NOT_FOUND);
      }
      account.group = group;
    }

    await this.accountRepo.save(account);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<void> {
    const account = await this.accountRepo.findOne({
      where: { id: userId, status: STATUS_ACTIVE },
      select: ['id', 'email', 'password', 'fullName', 'phone', 'avatarPath'],
    });

    if (!account) {
      throw new NotFoundException('Account not found', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
    }

    if (dto.newPassword) {
      if (!dto.oldPassword) {
        throw new BadRequestException(
          'Old password is required',
          ErrorCode.ACCOUNT_ERROR_INVALID_PASSWORD,
        );
      }

      const isMatch = await verifyPassword(dto.oldPassword, account.password);
      if (!isMatch) {
        throw new BadRequestException(
          'Old password is incorrect',
          ErrorCode.ACCOUNT_ERROR_INVALID_PASSWORD,
        );
      }

      account.password = await hashPassword(dto.newPassword);
    }

    if (dto.email && dto.email !== account.email) {
      const existEmail = await this.accountRepo.findOne({
        where: { email: dto.email },
      });

      if (existEmail) {
        throw new BadRequestException(
          'Email already exists',
          ErrorCode.ACCOUNT_ERROR_USERNAME_EXISTED,
        );
      }

      account.email = dto.email;
    }

    if (dto.fullName !== undefined) account.fullName = dto.fullName;
    if (dto.phone !== undefined) account.phone = dto.phone;
    if (dto.avatarPath !== undefined) account.avatarPath = dto.avatarPath;

    await this.accountRepo.save(account);
  }

  async delete(id: string): Promise<void> {
    const result = await this.accountRepo.update({ id }, { status: STATUS_DELETE });

    if (result.affected === 0) {
      throw new NotFoundException(`Account not found.`, ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
    }
  }
}
