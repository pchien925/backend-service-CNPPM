import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateComboGroupItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comboGroupId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  foodId!: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  extraPrice: number = 0;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  ordering?: number;
}
