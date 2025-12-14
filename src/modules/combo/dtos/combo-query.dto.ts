import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class ComboQueryDto extends Paginated {
  @ApiPropertyOptional({ description: 'Combo name for searching (fuzzy search)' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({ description: 'ID of the category' })
  @IsOptional()
  @IsInt({ message: 'Category ID must be an integer' })
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Filter by status (1: Active, 0: Inactive)' })
  @IsInt({ message: 'Status must be an integer' })
  @IsOptional()
  @Type(() => Number)
  status?: number;

  @ApiPropertyOptional({ description: 'Minimum base price' })
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum base price' })
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by tag ID' })
  @IsOptional()
  @IsInt({ message: 'Tag ID must be an integer' })
  @Type(() => Number)
  tagId?: number;
}
