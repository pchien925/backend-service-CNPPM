import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, Length, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID cannot be null' })
  @IsString()
  id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 255)
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(6, 255)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional()
  @IsOptional()
  avatarPath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'groupId must be a string' })
  groupId?: string;
}
