import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { Group } from '../group/entities/group.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { AccountDto } from './dtos/account.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { AccountMapper } from './account.mapper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    private readonly jwtService: JwtService,
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

  async login(dto: LoginAccountDto): Promise<LoginResponseDto> {
    // Tìm tài khoản theo username hoặc email
    const account = await this.accountRepo.findOne({
      where: [{ username: dto.usernameOrEmail }, { email: dto.usernameOrEmail }],
      relations: ['group'],
      select: ['id', 'username', 'email', 'password', 'fullName', 'phone', 'avatarPath', 'group'],
    });

    if (!account) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(dto.password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // Tạo JWT token
    const payload = {
      id: account.id,
      username: account.username,
      email: account.email,
    };
    const accessToken = this.jwtService.sign(payload);

    // Cập nhật lastLogin
    account.lastLogin = new Date();
    await this.accountRepo.save(account);

    const accountDto = AccountMapper.toResponse(account);
    return {
      accessToken,
      account: accountDto,
      tokenType: 'Bearer',
      expiresIn: 604800,
    };
  }
}
