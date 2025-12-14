import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAccountDto {
  @ApiProperty({
    description: 'Username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
