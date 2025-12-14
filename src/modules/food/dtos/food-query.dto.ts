import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class FoodQueryDto extends Paginated {
  @ApiPropertyOptional({ description: 'Filter by Food name (partial search)' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by Category ID' })
  @IsString({ message: 'Category ID must be a string' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by status (e.g., 1 for active)' })
  @IsInt()
  @IsOptional()
  status?: number;

  @ApiPropertyOptional({ description: 'Min basePrice' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Max basePrice' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by tag ID' })
  @IsOptional()
  @IsString({ each: true, message: 'Tag ID must be a string' })
  tagId?: string;
}
