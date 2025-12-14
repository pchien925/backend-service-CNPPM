import { ApiProperty } from '@nestjs/swagger';
import { FoodDto } from 'src/modules/food/dtos/food.dto';

export class ComboGroupItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  extraPrice!: number;

  @ApiProperty()
  ordering!: number;

  @ApiProperty({ type: FoodDto })
  food!: FoodDto;
}
