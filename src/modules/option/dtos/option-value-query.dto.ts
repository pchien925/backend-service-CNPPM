import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class OptionValueQueryDto extends Paginated {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  optionId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name must be not empty' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by status (1: Active, 0: Pending, -1: Inactive, -2: Deleted)',
  })
  @IsInt()
  @IsOptional()
  status?: number;
}
