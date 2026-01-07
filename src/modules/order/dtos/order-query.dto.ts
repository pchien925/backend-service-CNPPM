import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class OrderQueryDto extends Paginated {
  @ApiPropertyOptional({ description: 'Filter by Order Code' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Filter by Order Status (1:pending, 2:success, 3:failed, 4:refunded)',
  })
  @IsInt()
  @IsOptional()
  orderStatus?: number;

  @ApiPropertyOptional({ description: 'Filter by Branch ID' })
  @IsString()
  @IsOptional()
  branchId?: string;

  @ApiPropertyOptional({ description: 'Filter by Start Date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Filter by End Date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  toDate?: string;
}
