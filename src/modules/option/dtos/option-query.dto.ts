import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class OptionQueryDto extends Paginated {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty if provided' })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by status (1: Active, 0: Inactive)' })
  @IsInt({ message: 'Status must be an integer' })
  @IsOptional()
  status?: number;
}
