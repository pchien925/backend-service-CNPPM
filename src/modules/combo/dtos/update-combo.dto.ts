import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateComboDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id!: number;

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
  @IsInt({ message: 'Category ID must be an integer' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId!: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsArray({ message: 'Tag IDs must be an array' })
  @IsInt({ each: true, message: 'Each tag ID must be an integer' })
  @IsOptional()
  tagIds?: number[];
}
