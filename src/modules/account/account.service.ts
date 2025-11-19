import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_PENDING } from 'src/constants/app.constant';
import { EmailService } from 'src/shared/services/email/email.service';
import { verifyPassword } from 'src/utils';
import { Repository } from 'typeorm';
import { UserDetailsDto } from '../auth/dtos/user-details.dto';
import { Group } from '../group/entities/group.entity';
import { AccountMapper } from './account.mapper';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { ResendOtpDto } from '../auth/dtos/resend-otp.dto';
import { VerifyOtpDto } from '../auth/dtos/verify-otp.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async list(): Promise<AccountDto[]> {
    const accounts = await this.accountRepo.find({ relations: ['group'] });
    return AccountMapper.toResponseList(accounts);
  }

  async create(dto: CreateAccountDto): Promise<{ message: string; email: string }> {
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

    // Tạo và lưu OTP
    const otpCode = this.emailService.generateOtp();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5); // OTP có hiệu lực 5 phút

    account.otpCode = otpCode;
    account.otpExpiresAt = otpExpiresAt;
    account.status = STATUS_PENDING;

    const saved = await this.accountRepo.save(account);

    // Gửi OTP qua email
    try {
      await this.emailService.sendOtpEmail(dto.email, otpCode, dto.fullName);
    } catch (error) {
      // Nếu gửi email thất bại, xóa tài khoản đã tạo
      await this.accountRepo.remove(saved);
      throw new BadRequestException('Failed to send OTP email. Please try again.');
    }

    return {
      message: 'Account created successfully. Please check your email for OTP verification.',
      email: dto.email,
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string; account: AccountDto }> {
    const account = await this.accountRepo.findOne({
      where: { email: dto.email },
      relations: ['group'],
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (!account.otpCode || !account.otpExpiresAt) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }

    if (new Date() > account.otpExpiresAt) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (account.otpCode !== dto.otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Xác thực thành công - cập nhật trạng thái
    account.otpCode = null;
    account.otpExpiresAt = null;
    account.status = STATUS_ACTIVE;

    const updatedAccount = await this.accountRepo.save(account);
    const accountDto = AccountMapper.toResponse(updatedAccount);

    return {
      message: 'Email verified successfully',
      account: accountDto,
    };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
    const account = await this.accountRepo.findOne({
      where: { email: dto.email },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    // Tạo OTP mới
    const otpCode = this.emailService.generateOtp();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);

    account.otpCode = otpCode;
    account.otpExpiresAt = otpExpiresAt;

    await this.accountRepo.save(account);

    // Gửi OTP mới qua email
    try {
      await this.emailService.sendOtpEmail(dto.email, otpCode, account.fullName);
    } catch (error) {
      throw new BadRequestException('Failed to send OTP email. Please try again.');
    }

    return {
      message: 'New OTP has been sent to your email',
    };
  }
  async getAccountByToken(token: string): Promise<AccountDto> {
    if (!token) {
      throw new BadRequestException('Token là bắt buộc');
    }

    let payload: any;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      throw new UnauthorizedException('Xác thực thất bại');
    }

    const accountId = payload.id;

    if (!accountId) {
      throw new UnauthorizedException('Token không chứa thông tin tài khoản');
    }

    const account = await this.accountRepo.findOne({
      where: { id: accountId },
      relations: ['group'],
    });

    if (!account) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    return AccountMapper.toResponse(account);
  }

  async getAccountById(id: number): Promise<AccountDto> {
    const account = await this.accountRepo.findOne({
      where: { id: id },
      relations: ['group', 'group.permissions'],
    });

    if (!account) {
      throw new BadRequestException('Tài khoản không tồn tại');
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
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = verifyPassword(password, account.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
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
}
