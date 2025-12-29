import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateComboGroupItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Food ID must be a string' })
  @IsOptional()
  foodId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  extraPrice?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsInt({ message: 'Ordering must be an integer' })
  @IsOptional()
  ordering?: number;
}
