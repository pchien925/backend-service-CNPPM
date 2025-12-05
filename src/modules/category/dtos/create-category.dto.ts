import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @ApiPropertyOptional({ description: 'Category description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({ description: 'Category kind (default 0)' })
  @IsOptional()
  @IsInt({ message: 'Kind must be an integer' })
  @Min(0, { message: 'Kind must be >= 0' })
  kind?: number;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Display order (default 0)' })
  @IsOptional()
  @IsInt({ message: 'Ordering must be an integer' })
  @Min(0, { message: 'Ordering must be >= 0' })
  ordering?: number;

  @ApiPropertyOptional({ description: 'ID of the parent category' })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer' })
  parentId?: number;
}
