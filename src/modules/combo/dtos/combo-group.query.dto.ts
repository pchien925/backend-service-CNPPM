import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class ComboGroupQueryDto extends Paginated {
  @ApiProperty({ description: 'ID of the combo' })
  @IsNotEmpty({ message: 'Combo ID is required' })
  @IsString({ message: 'Combo ID must be a string' })
  comboId: string;

  @ApiPropertyOptional({ description: 'Combo group name for searching (fuzzy search)' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by status (1: Active, 0: Inactive)' })
  @IsInt({ message: 'Status must be an integer' })
  @IsOptional()
  status?: number;
}
