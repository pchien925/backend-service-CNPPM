import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateNationDto {
  @ApiProperty({ description: 'ID of the nation to update' })
  @IsNotEmpty({ message: 'ID cannot be null' })
  @IsString({ message: 'ID must be a string' })
  id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'Kind must be an integer' })
  @Min(1, { message: 'Kind must be >= 1' })
  kind?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;

  @ApiPropertyOptional({ description: 'Status' })
  @IsOptional()
  @IsInt({ message: 'Status must be an integer' })
  status?: number;
}
