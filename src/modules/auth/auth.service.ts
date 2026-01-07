import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_PENDING } from 'src/constants/app.constant';
import { EmailService } from 'src/shared/services/email/email.service';
import { hashPassword } from 'src/utils';
import { Repository } from 'typeorm';
import { AccountMapper } from '../account/account.mapper';
import { AccountService } from '../account/account.service';
import { Account } from '../account/entities/account.entity';
import { Group } from '../group/entities/group.entity';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserDetailsDto } from './dtos/user-details.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { TokenDto } from '../account/dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(user: UserDetailsDto): Promise<TokenDto> {
    const payload = {
      sub: user.id,
      id: user.id,
      username: user.username,
      kind: user.kind,
      authorities: user.authorities,
      isSuperAdmin: user.isSuperAdmin,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { access_token: access_token, user_kind: user.kind };
  }

  async register(dto: RegisterDto): Promise<void> {
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
    account.password = await hashPassword(dto.password);

    // try {
    //   await this.emailService.sendOtpEmail(dto.email, otpCode, dto.fullName);
    // } catch {
    //   throw new BadRequestException('Failed to send OTP email. Please try again.');
    // }

    await this.accountRepo.save(account);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<void> {
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

    // if (account.otpCode !== dto.otpCode) {
    //   throw new BadRequestException('Invalid OTP code');
    // }

    // Xác thực thành công - cập nhật trạng thái
    account.otpCode = null;
    account.otpExpiresAt = null;
    account.status = STATUS_ACTIVE;

    await this.accountRepo.save(account);
  }

  async resendOtp(dto: ResendOtpDto): Promise<void> {
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
    } catch {
      throw new BadRequestException('Failed to send OTP email. Please try again.');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const account = await this.accountRepo.findOne({
      where: { email: dto.email },
    });

    if (!account) {
      throw new BadRequestException('Account not found with this email');
    }

    // Generate OTP for password reset
    const otpCode = this.emailService.generateOtp();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // 10 phút cho reset password

    // Update account with reset OTP
    account.otpCode = otpCode;
    account.otpExpiresAt = otpExpiresAt;
    account.resetPwdCode = otpCode;
    account.resetPwdTime = otpExpiresAt;

    await this.accountRepo.save(account);

    // Send forgot password email
    try {
      await this.emailService.sendForgotPasswordEmail(dto.email, otpCode, account.fullName);
    } catch {
      throw new BadRequestException('Failed to send reset password email. Please try again.');
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const account = await this.accountRepo.findOne({
      where: { email: dto.email },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (!account.resetPwdCode || !account.resetPwdTime) {
      throw new BadRequestException('No password reset request found. Please request a new one.');
    }

    if (new Date() > account.resetPwdTime) {
      throw new BadRequestException('Password reset OTP has expired. Please request a new one.');
    }

    if (account.resetPwdCode !== dto.otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Hash new password
    const hashedPassword = await hashPassword(dto.newPassword);

    // Update password and clear reset fields
    account.password = hashedPassword;
    account.resetPwdCode = null;
    account.resetPwdTime = null;
    account.otpCode = null;
    account.otpExpiresAt = null;

    await this.accountRepo.save(account);
  }

  async validateUser(username: string, password: string): Promise<UserDetailsDto | null> {
    return await this.accountService.validateCredentials(username, password);
  }
}
