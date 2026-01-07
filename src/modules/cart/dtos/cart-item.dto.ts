import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CartItemOptionDto } from './cart-item-option.dto';
import { CartItemComboSelectionDto } from './cart-item-combo-selection.dto';

export class CartItemDto {
  id: string;
  itemKind: number;
  itemId: string;
  quantity: number;
  basePrice: number;
  note?: string;

  @ValidateNested({ each: true })
  @Type(() => CartItemOptionDto)
  options: CartItemOptionDto[];

  @ValidateNested({ each: true })
  @Type(() => CartItemComboSelectionDto)
  comboSelections: CartItemComboSelectionDto[];
}
