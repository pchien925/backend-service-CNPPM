import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFoodOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  ordering?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  requirementType?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  maxSelect?: number;
}
