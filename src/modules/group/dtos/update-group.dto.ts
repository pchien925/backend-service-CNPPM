import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ description: 'ID of the group to update' })
  @IsNotEmpty({ message: 'ID is required for update' })
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayUnique({ message: 'Permissions must be unique' })
  @IsString({ each: true, message: 'Each permission must be a string' })
  permissions!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  kind!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  status?: number;
}
