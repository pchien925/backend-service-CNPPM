import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateComboGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'ID must be a string' })
  id!: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt({ message: 'Min select must be an integer' })
  @Min(0)
  @IsOptional()
  minSelect?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsInt({ message: 'Max select must be an integer' })
  @Min(1)
  @IsOptional()
  maxSelect?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsInt({ message: 'Ordering must be an integer' })
  @IsOptional()
  ordering?: number;

  @ApiPropertyOptional({ description: 'Filter by status (1: Active, 0: Inactive)' })
  @IsInt({ message: 'Status must be an integer' })
  @IsOptional()
  status?: number;
}
