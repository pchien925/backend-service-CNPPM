import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(email: string, otp: string, fullName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực tài khoản - Mã OTP',
      template: 'register',
      context: {
        name: fullName,
        otp: otp,
      },
    });
  }

  async sendForgotPasswordEmail(email: string, otp: string, fullName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu - Mã OTP',
      template: 'forgot-password',
      context: {
        name: fullName,
        otp: otp,
      },
    });
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
