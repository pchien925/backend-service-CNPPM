import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class FoodOptionPayloadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id!: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  ordering?: number;

  @ApiPropertyOptional({ description: '0: optional, 1: required', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  requirementType?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxSelect?: number;
}
