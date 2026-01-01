import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FoodOptionSortItemDto {
  @ApiProperty({ description: 'ID FoodOption (tbl_food_option)' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp mới' })
  @IsNumber()
  ordering: number;
}
