import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
  id: string;
  totalPrice: number;
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
