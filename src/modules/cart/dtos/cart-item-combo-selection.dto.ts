import { FoodDto } from 'src/modules/food/dtos/food.dto';

export class CartItemComboSelectionDto {
  id: string;
  selectedFood: FoodDto;
  extraPrice: number;
}
