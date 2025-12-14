import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'ID of the category to update' })
  @IsNotEmpty({ message: 'ID cannot be null' })
  @IsInt({ message: 'ID must be an integer' })
  id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'Kind must be an integer' })
  @Min(0, { message: 'Kind must be >= 0' })
  kind?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'Ordering must be an integer' })
  @Min(0, { message: 'Ordering must be >= 0' })
  ordering?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;

  @ApiPropertyOptional({ description: 'Status (1: Active, 0: Inactive, -1: Deleted)' })
  @IsOptional()
  @IsInt({ message: 'Status must be an integer' })
  status?: number;
}
