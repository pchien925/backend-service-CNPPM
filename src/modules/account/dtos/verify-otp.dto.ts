import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'OTP code (6 digits)' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otpCode!: string;
}
