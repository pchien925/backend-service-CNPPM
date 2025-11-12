import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { Group } from '../group/entities/group.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AccountDto } from './dtos/account.dto';
import { AccountMapper } from './account.mapper';

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

  async create(dto: CreateAccountDto): Promise<AccountDto> {
    // Kiểm tra username/email đã tồn tại
    const existUser = await this.accountRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const account = AccountMapper.toEntityFromCreate(dto);

    if (dto.groupId) {
      const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
      if (!group) {
        throw new BadRequestException('Group not found');
      }
      account.group = group;
    }

    const saved = await this.accountRepo.save(account);
    return AccountMapper.toResponse(saved);
  }
}
