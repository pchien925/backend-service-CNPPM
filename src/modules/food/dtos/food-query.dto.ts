import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto'; // Giả định Paginated là DTO cơ bản

export class FoodQueryDto extends Paginated {
  @ApiPropertyOptional({ description: 'Food name for searching (fuzzy search)' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by exact category ID' })
  @IsOptional()
  @IsInt({ message: 'Category ID must be an integer' })
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Filter by minimum base price' })
  @IsOptional()
  @IsNumber({}, { message: 'Min price must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Min price must be non-negative' })
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum base price' })
  @IsOptional()
  @IsNumber({}, { message: 'Max price must be a number' })
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by status (e.g., 1, 0, -1, -2)' })
  @IsInt({ message: 'Status must be an integer' })
  @IsOptional()
  @Type(() => Number)
  status?: number;

  @ApiPropertyOptional({ description: 'Filter by minimum cooking time (minutes)' })
  @IsOptional()
  @IsInt({ message: 'Min cooking time must be an integer' })
  @Type(() => Number)
  @Min(0)
  minCookingTime?: number;
}
