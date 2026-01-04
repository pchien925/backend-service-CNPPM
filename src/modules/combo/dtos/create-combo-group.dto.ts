import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateComboGroupDto {
  @ApiProperty({ description: 'ID of the parent combo' })
  @IsString({ message: 'Combo ID must be a string' })
  @IsNotEmpty({ message: 'Combo ID is required' })
  comboId!: string;

  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

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
}
