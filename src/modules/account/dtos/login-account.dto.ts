import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAccountDto {
  @ApiProperty({ description: 'Username hoặc email' })
  @IsNotEmpty({ message: 'Username/Email is required' })
  @IsString()
  usernameOrEmail!: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password!: string;
}
