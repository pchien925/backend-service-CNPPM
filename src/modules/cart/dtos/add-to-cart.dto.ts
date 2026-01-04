import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '123456789', description: 'ID of the food or combo' })
  @IsNotEmpty({ message: 'Item ID is required' })
  @IsString()
  itemId: string;

  @ApiProperty({ enum: [1, 2], example: 1, description: '1: Food, 2: Combo' })
  @IsInt()
  @IsIn([1, 2], { message: 'itemKind must be 1 (Food) or 2 (Combo)' })
  itemKind: number;

  @ApiProperty({ example: 1, minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(99, { message: 'Quantity cannot exceed 99' })
  quantity: number;

  @ApiPropertyOptional({ example: 'No onions', description: 'Special instructions' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ type: [String], example: ['opt_1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each option ID must be a string' })
  optionIds?: string[];

  @ApiPropertyOptional({ type: [String], example: ['food_001'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each combo selection ID must be a string' })
  comboSelectionFoodIds?: string[];
}
