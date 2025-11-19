import { Body, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { AccountService } from '../account/account.service';
import { CreateAccountDto } from '../account/dtos/create-account.dto';
import { AuthService } from './auth.service';
import { loginDto } from './dtos/login.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

@ApiController('auth', { auth: true })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  // LOGIN
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() dto: loginDto, @Req() req: any) {
    return this.authService.login(req.user);
  }

  // REGISTER
  @Public()
  @Post('register')
  async register(@Body() dto: CreateAccountDto) {
    const result = await this.accountService.create(dto);
    return new ApiResponse(
      result,
      'Registration successful. Please check your email.',
      HttpStatus.CREATED,
    );
  }

  // VERIFY OTP
  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.accountService.verifyOtp(dto);
    return new ApiResponse(result, 'Email verified successfully', HttpStatus.OK);
  }

  // RESEND OTP
  @Public()
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    const result = await this.accountService.resendOtp(dto);
    return new ApiResponse(result, 'OTP resent successfully', HttpStatus.OK);
  }
}
