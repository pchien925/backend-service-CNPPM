import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class GroupQueryDto extends Paginated {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty if provided' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'Kind must be an integer' })
  kind?: number;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsInt()
  @IsOptional()
  status?: number;
}
