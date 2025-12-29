import { Body, Delete, Get, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { AccountService } from './account.service';
import { AccountQueryDto } from './dtos/account-query.dto';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@ApiController('account', { auth: true })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  @Permissions('ACC_L')
  @ApiOperation({ summary: 'Get list of accounts' })
  async list(@Query() query: AccountQueryDto): Promise<ApiResponse<ResponseListDto<AccountDto[]>>> {
    const result = await this.accountService.findAll(query);
    return ApiResponse.success(result, 'Get list accounts successfully');
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current account profile' })
  async profile(@Req() req: any) {
    const account = await this.accountService.getAccountById(req.user.id);
    return ApiResponse.success(account, 'Get profile successfully', HttpStatus.OK);
  }

  @Get('get/:id')
  @Permissions('ACC_V')
  @ApiOperation({ summary: 'Create user account' })
  async get(@Param('id') id: string): Promise<ApiResponse<AccountDto>> {
    const account = await this.accountService.findOne(id);
    return ApiResponse.success(account, 'Get account successfully');
  }

  @Post('create')
  @Permissions('ACC_C')
  @ApiOperation({ summary: 'Create user account' })
  async create(@Body() dto: CreateAccountDto): Promise<ApiResponse<void>> {
    await this.accountService.create(dto);
    return ApiResponse.successMessage('User created successfully');
  }

  @Put('update')
  @Permissions('ACC_U')
  @ApiOperation({ summary: 'Update user account' })
  async update(@Body() dto: UpdateAccountDto): Promise<ApiResponse<void>> {
    await this.accountService.update(dto);
    return ApiResponse.successMessage('User updated successfully');
  }

  @Put('update-profile')
  @ApiOperation({ summary: 'Update profile and/or change password' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto): Promise<ApiResponse<void>> {
    await this.accountService.updateProfile(req.user.id, dto);
    return ApiResponse.successMessage('Profile updated successfully');
  }

  @Delete('delete/:id')
  @Permissions('ACC_D')
  @ApiOperation({ summary: 'Delete user account' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.accountService.delete(id);
    return ApiResponse.successMessage('User deleted successfully');
  }
}
