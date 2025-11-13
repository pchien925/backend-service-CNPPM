import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from './account.dto';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken!: string;

  @ApiProperty({ description: 'Thông tin tài khoản' })
  account!: AccountDto;

  @ApiProperty({ description: 'Token type' })
  tokenType!: string;

  @ApiProperty({ description: 'Thời gian hết hạn token (seconds)' })
  expiresIn!: number;
}
