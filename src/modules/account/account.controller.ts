import { Body, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { AccountService } from './account.service';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';

@ApiController('account', { auth: true })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  @Permissions('ACC_L')
  @ApiOperation({ summary: 'Get all accounts' })
  async list(): Promise<ApiResponse<AccountDto[]>> {
    const accounts = await this.accountService.list();
    return ApiResponse.success(accounts, 'Get list accounts successfully', HttpStatus.OK);
  }
  @Get('profile')
  @ApiOperation({ summary: 'Get current account profile' })
  async profile(@Req() req: any) {
    const account = await this.accountService.getAccountById(req.user.id);
    return ApiResponse.success(account, 'Get profile successfully', HttpStatus.OK);
  }

  @Post('create')
  @Permissions('ACC_C')
  @ApiOperation({ summary: 'Create user account' })
  async create(@Body() dto: CreateAccountDto): Promise<ApiResponse<void>> {
    await this.accountService.create(dto);
    return ApiResponse.successMessage('User created successfully');
  }

  @Delete('delete/:id')
  @Permissions('ACC_D')
  @ApiOperation({ summary: 'Delete user account' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.accountService.deleteAccount(id);
    return ApiResponse.successMessage('User deleted successfully');
  }
}
