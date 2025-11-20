import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class AdminCreateAccountDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'kind must be an integer' })
  kind!: number;

  @ApiProperty({ example: 'testuser' })
  @IsNotEmpty({ message: 'username should not be empty' })
  @Length(3, 255, { message: 'username must be between 3 and 255 characters' })
  username!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'password should not be empty' })
  @Length(6, 255, { message: 'password must be between 6 and 255 characters' })
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'fullName should not be empty' })
  fullName!: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatarPath?: string;

  @ApiProperty({ example: 16, required: false })
  @IsOptional()
  @IsInt({ message: 'groupId must be an integer' })
  groupId?: number;
}
