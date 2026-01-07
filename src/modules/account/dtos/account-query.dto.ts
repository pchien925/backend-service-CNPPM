import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class AccountQueryDto extends Paginated {
  @ApiPropertyOptional()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Filter by Group ID' })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiPropertyOptional({ description: 'Filter by Account Kind' })
  @IsOptional()
  @IsInt()
  kind?: number;

  @ApiPropertyOptional({ description: 'Filter by Status' })
  @IsOptional()
  @IsInt()
  status?: number;
}
