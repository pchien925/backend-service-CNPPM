import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFoodOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  foodId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  optionId!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  ordering!: number;

  @ApiProperty({ description: '0: optional, 1: required' })
  @IsInt()
  requirementType!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxSelect!: number;
}
