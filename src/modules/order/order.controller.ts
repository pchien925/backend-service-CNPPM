import { Body, Get, Ip, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@ApiController('order', { auth: true })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Create an order from current cart' })
  async checkout(@Body() dto: CreateOrderDto, @Ip() ip: string) {
    const order = await this.orderService.checkout(dto, ip);
    return ApiResponse.success(order, 'Order placed successfully');
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user order history' })
  async getMyOrders() {
    const orders = await this.orderService.getMyOrders();
    return ApiResponse.success(orders, 'Order history retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed information of a specific order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async getOrderDetail(@Param('id') id: string) {
    const order = await this.orderService.getOrderDetail(id);
    return ApiResponse.success(order, 'Order details retrieved successfully');
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async cancelOrder(@Param('id') id: string, @Body('reason') reason: string) {
    const order = await this.orderService.cancelOrder(id, reason);
    return ApiResponse.success(order, 'Order cancelled successfully');
  }
}
