import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class CategoryQueryDto extends Paginated {
  @ApiPropertyOptional({ description: 'Category name for searching (fuzzy search)' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  name?: string;

  @ApiPropertyOptional({ description: 'ID of the parent category' })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer' })
  @Type(() => Number)
  parentId?: number;

  @ApiPropertyOptional({ description: 'The kind/type of category' })
  @IsOptional()
  @IsInt({ message: 'Kind must be an integer' })
  @Type(() => Number)
  kind?: number;

  @ApiPropertyOptional({
    description: 'Filter by status (1: Active, 0: Pending, -1: Inactive, -2: Deleted)',
  })
  @IsInt()
  @IsOptional()
  status?: number;
}
