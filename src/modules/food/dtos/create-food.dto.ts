import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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
  @IsNotEmpty()
  @IsInt()
  categoryId!: number;

  @ApiPropertyOptional({ type: [Number], description: 'List of Tag IDs' })
  @IsOptional()
  @IsArray()
  tagIds?: number[];

  @ApiPropertyOptional({
    type: [FoodOptionPayloadDto],
    description: 'List of Options with configurations',
  })
  @IsOptional()
  @IsArray()
  options?: FoodOptionPayloadDto[];
}
