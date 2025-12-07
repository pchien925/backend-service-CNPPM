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
  @IsNotEmpty()
  @IsInt()
  id!: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({
    type: [Number],
    description: 'List of Tag IDs (overwrite or sync existing tags)',
  })
  @IsOptional()
  @IsArray()
  tagIds?: number[];

  @ApiPropertyOptional({
    type: [FoodOptionPayloadDto],
    description: 'List of Options (overwrite or sync existing options)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  options?: FoodOptionPayloadDto[];
}
