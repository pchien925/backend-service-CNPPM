import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE } from 'src/constants/app.constant';
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

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
  ) {}

  async list(): Promise<AccountDto[]> {
    const accounts = await this.accountRepo.find({ relations: ['group'] });
    return AccountMapper.toResponseList(accounts);
  }

  async getAccountById(id: number): Promise<AccountDto> {
    const account = await this.accountRepo.findOne({
      where: { id: id },
      relations: ['group', 'group.permissions'],
    });

    if (!account) {
      throw new NotFoundException('Tài khoản không tồn tại', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
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

    // Hash password before saving
    account.password = await hashPassword(dto.password);

    const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    account.group = group;

    account.status = STATUS_ACTIVE;

    account.otpCode = null;
    account.otpExpiresAt = null;

    await this.accountRepo.save(account);
  }

  async deleteAccount(id: number): Promise<void> {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    await this.accountRepo.remove(account);
  }
}
