import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsInt()
  kind!: number;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 255)
  username!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 255)
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  avatarPath?: string;

  @ApiProperty()
  @IsOptional()
  groupId?: number; //default gắn 16 nha
}
