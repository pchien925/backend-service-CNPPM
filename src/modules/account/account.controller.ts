import { Body, Get, HttpStatus, Post } from '@nestjs/common';
import { AccountDto } from './dtos/account.dto';
import { AccountService } from './account.service';
import { ApiController } from 'src/decorators/api-controller.decorator';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
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

  @Post('create')
  @ApiOperation({ summary: 'Create new account' })
  async create(@Body() dto: CreateAccountDto): Promise<ApiResponse<AccountDto>> {
    const account = await this.accountService.create(dto);
    return new ApiResponse(account, 'Account created successfully', HttpStatus.CREATED);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to the system' })
  async login(@Body() dto: LoginAccountDto): Promise<ApiResponse<LoginResponseDto>> {
    const result = await this.accountService.login(dto);
    return new ApiResponse(result, 'Login successfully', HttpStatus.OK);
  }
}
