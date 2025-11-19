import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsInt({ message: 'kind must be an integer' })
  kind!: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'username should not be empty' })
  @Length(3, 255, { message: 'username must be between 3 and 255 characters' })
  username!: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password should not be empty' })
  @Length(6, 255, { message: 'password must be between 6 and 255 characters' })
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'groupId must be an integer' })
  groupId?: number; //default gắn 16
}
