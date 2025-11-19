import { Body, Get, Headers, HttpStatus, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { ResendOtpDto } from '../auth/dtos/resend-otp.dto';
import { VerifyOtpDto } from '../auth/dtos/verify-otp.dto';
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
  @Get('profile')
  async profile(@Req() req: any) {
    const account = await this.accountService.getAccountById(req.user.id);
    return new ApiResponse(account, 'Get profile successfully', HttpStatus.OK);
  }
}
