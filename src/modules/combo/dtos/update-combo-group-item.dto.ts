import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateComboGroupItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  extraPrice?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  ordering?: number;
}
