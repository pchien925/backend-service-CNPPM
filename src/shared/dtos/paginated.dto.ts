import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class Paginated {
  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'Current page (starting from 0)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(0, { message: 'page must be at least 0' })
  page?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    default: 20,
    description: 'Number of records per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  limit?: number = 20;
}
