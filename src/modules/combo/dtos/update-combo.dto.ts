import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateComboDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Base price is required' })
  basePrice!: number; // decimal(10,2)

  @ApiPropertyOptional()
  @IsString({ message: 'Image URL must be a string' })
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsInt({ message: 'Cooking time must be an integer' })
  @IsOptional()
  cookingTime?: number;

  @ApiPropertyOptional()
  @IsInt({ message: 'Ordering must be an integer' })
  @IsOptional()
  ordering?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'Status must be an integer' })
  status?: number;

  @ApiProperty()
  @IsString({ message: 'Category ID must be a string' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray({ message: 'Tag IDs must be an array' })
  @IsString({ each: true, message: 'Each tag ID must be a string' })
  @IsOptional()
  tagIds?: string[];
}
