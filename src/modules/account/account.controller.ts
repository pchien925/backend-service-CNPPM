import { Get, HttpStatus, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { AccountService } from './account.service';
import { AccountDto } from './dtos/account.dto';

@ApiController('account', { auth: true })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  @Permissions('ACC_L')
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
