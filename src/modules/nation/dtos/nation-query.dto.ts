import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class NationQueryDto extends Paginated {
  @ApiPropertyOptional({ description: 'Nation name for searching (fuzzy search)' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'ID of the parent nation (Province for District, District for Ward)',
  })
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;

  @ApiPropertyOptional({ description: 'Nation Kind (1: Ward, 2: District, 3: Province)' })
  @IsOptional()
  @IsInt({ message: 'Kind must be an integer' })
  kind?: number;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsInt()
  @IsOptional()
  status?: number;
}
