import { Body, Get, Headers, HttpStatus, Post, Query, UnauthorizedException } from '@nestjs/common';
import { AccountDto } from './dtos/account.dto';
import { AccountService } from './account.service';
import { ApiController } from 'src/decorators/api-controller.decorator';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ApiOperation } from '@nestjs/swagger';

@ApiController('accounts', { auth: true })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all accounts' })
  async list(): Promise<ApiResponse<AccountDto[]>> {
    const accounts = await this.accountService.list();
    return new ApiResponse(accounts, 'Get list accounts successfully', HttpStatus.OK);
  }

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

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code to complete registration' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<ApiResponse<{ message: string; account: AccountDto }>> {
    const result = await this.accountService.verifyOtp(dto);
    return new ApiResponse(result, 'Email verified successfully', HttpStatus.OK);
  }

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
  @ApiOperation({ summary: 'Get current account profile (from token)' })
  async getProfile(@Headers('Authorization') authHeader: string): Promise<ApiResponse<AccountDto>> {
    if (!authHeader) throw new UnauthorizedException('Authorization header is missing');
    const token = authHeader.replace('Bearer ', '');
    const account = await this.accountService.getAccountByToken(token);
    return new ApiResponse(account, 'Get profile successfully', HttpStatus.OK);
  }
}
