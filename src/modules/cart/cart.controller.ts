import { Body, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@ApiTags('Cart')
@ApiController('cart', { auth: true })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('my-cart')
  @ApiOperation({ summary: 'Get current user cart' })
  async getMyCart() {
    const cart = await this.cartService.getMyCart();
    return ApiResponse.success(cart, 'Cart retrieved successfully');
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a food or combo to cart' })
  async addToCart(@Body() dto: AddToCartDto) {
    const cart = await this.cartService.addToCart(dto);
    return ApiResponse.success(cart, 'Item added to cart');
  }

  @Patch('update-item')
  @ApiOperation({ summary: 'Update item quantity or note (set quantity 0 to remove)' })
  async updateItem(@Body() dto: UpdateCartItemDto) {
    const cart = await this.cartService.updateCartItem(dto);
    return ApiResponse.success(cart, 'Cart updated successfully');
  }

  @Delete('item/:id')
  @ApiOperation({ summary: 'Remove a specific item from cart' })
  async deleteItem(@Param('id') id: string) {
    const cart = await this.cartService.deleteCartItem(id);
    return ApiResponse.success(cart, 'Item removed from cart');
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Remove all items from the cart' })
  async clearCart() {
    const cart = await this.cartService.clearMyCart();
    return ApiResponse.success(cart, 'Cart cleared successfully');
  }
}
