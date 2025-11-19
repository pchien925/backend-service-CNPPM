import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'OTP code should not be empty' })
  @Length(6, 6, { message: 'OTP code must be 6 characters' })
  otpCode!: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @IsNotEmpty({ message: 'New password should not be empty' })
  @Length(6, 255, { message: 'New password must be between 6 and 255 characters' })
  newPassword!: string;
}
