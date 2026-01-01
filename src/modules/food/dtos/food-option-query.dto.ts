import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class FoodOptionQueryDto extends Paginated {
  @ApiProperty()
  @IsNotEmpty({ message: 'Food ID is required' })
  @IsString()
  foodId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  optionId?: string;
}
