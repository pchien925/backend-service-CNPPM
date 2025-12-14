import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class Paginated {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Current page (starting from 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
    description: 'Number of records per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  limit?: number = 10;
}
