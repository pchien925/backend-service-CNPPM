import { Body, Get, Headers, HttpStatus, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiController('account', { auth: true })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all accounts' })
  async list(): Promise<ApiResponse<AccountDto[]>> {
    const accounts = await this.accountService.list();
    return new ApiResponse(accounts, 'Get list accounts successfully', HttpStatus.OK);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new account and send OTP to email' })
  async register(
    @Body() dto: CreateAccountDto,
  ): Promise<ApiResponse<{ message: string; email: string }>> {
    const result = await this.accountService.create(dto);
    return new ApiResponse(
      result,
      'Registration successful. Please check your email for OTP.',
      HttpStatus.CREATED,
    );
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code to complete registration' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<ApiResponse<{ message: string; account: AccountDto }>> {
    const result = await this.accountService.verifyOtp(dto);
    return new ApiResponse(result, 'Email verified successfully', HttpStatus.OK);
  }

  @Public()
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP code to email' })
  async resendOtp(@Body() dto: ResendOtpDto): Promise<ApiResponse<{ message: string }>> {
    const result = await this.accountService.resendOtp(dto);
    return new ApiResponse(result, 'OTP resent successfully', HttpStatus.OK);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to the system' })
  async login(@Body() dto: LoginAccountDto): Promise<ApiResponse<LoginResponseDto>> {
    const result = await this.accountService.login(dto);
    return new ApiResponse(result, 'Login successfully', HttpStatus.OK);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current account profile' })
  async getProfile(@Req() req: any) {
    const account = await this.accountService.getAccountById(req.user.id);
    return new ApiResponse(account, 'Get profile successfully', HttpStatus.OK);
  }
}
