import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOptionValueDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString()
  name!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Extra price cannot be null' })
  @IsNumber()
  @Min(0)
  extraPrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  ordering?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Option ID cannot be null' })
  @IsString()
  optionId!: string;
}
