import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ example: 'cart_item_001' })
  @IsNotEmpty({ message: 'Cart Item ID is required' })
  @IsString()
  cartItemId: string;

  @ApiProperty({ example: 2, minimum: 0, description: 'Set to 0 to remove item' })
  @IsInt()
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity: number;

  @ApiPropertyOptional({ example: 'Extra spicy' })
  @IsOptional()
  @IsString()
  note?: string;
}
