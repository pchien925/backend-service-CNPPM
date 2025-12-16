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

export class UpdateFoodDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID cannot be null' })
  @IsString()
  id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  cookingTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  ordering?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  status?: number;

  @ApiPropertyOptional({ description: 'ID of the category' })
  @IsOptional()
  @IsString({ message: 'Category ID must be a string' })
  categoryId?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'List of Tag IDs (overwrite or sync existing tags)',
  })
  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @ApiPropertyOptional({
    type: [FoodOptionPayloadDto],
    description: 'List of Options (overwrite or sync existing options)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  options?: FoodOptionPayloadDto[];
}
