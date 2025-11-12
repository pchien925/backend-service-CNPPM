import { IsOptional, IsEmail, Length } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @Length(3, 255)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(6, 255)
  password?: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  avatarPath?: string;
}
