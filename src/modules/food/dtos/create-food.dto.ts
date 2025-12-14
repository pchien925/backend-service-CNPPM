import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { FoodOptionPayloadDto } from './food-option-payload.dto';

export class CreateFoodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Cooking time in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  cookingTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  ordering?: number;

  @ApiProperty()
  @IsString({ message: 'Category ID must be a string' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId!: string;

  @ApiPropertyOptional({ type: [String], description: 'List of Tag IDs' })
  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @ApiPropertyOptional({
    type: [FoodOptionPayloadDto],
    description: 'List of Options with configurations',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  options?: FoodOptionPayloadDto[];
}
