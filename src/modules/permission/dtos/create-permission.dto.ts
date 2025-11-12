import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permissionCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  showMenu?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameGroup: string;
}
