import { Body, Get, Param, Post, Put, Query, Ip } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { OrderQueryDto } from './dtos/order-query.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Order')
@ApiController('order', { auth: true })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Customer: Create new order and get payment URL' })
  async checkout(@Body() dto: CreateOrderDto, @Ip() ip: string): Promise<ApiResponse<string>> {
    const paymentUrl = await this.orderService.checkout(dto, ip);
    return ApiResponse.success(paymentUrl, 'Order initiated successfully');
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Customer: Get personal order history' })
  async getMyOrders(): Promise<ApiResponse<OrderDto[]>> {
    const orders = await this.orderService.getMyOrders();
    return ApiResponse.success(orders, 'Get history successfully');
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Customer: Get order detail' })
  async getDetail(@Param('id') id: string): Promise<ApiResponse<OrderDto>> {
    const order = await this.orderService.getOrderDetail(id);
    return ApiResponse.success(order, 'Get order detail successfully');
  }

  @Put('cancel/:id')
  @ApiOperation({ summary: 'Customer: Cancel a pending order' })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<ApiResponse<void>> {
    await this.orderService.cancelOrder(id, reason);
    return ApiResponse.successMessage('Order cancelled successfully');
  }

  // --- PHẦN DÀNH CHO ADMIN ---

  @Get('admin/list')
  @Permissions('ORD_L')
  @ApiOperation({ summary: 'Admin: Get all orders with filters' })
  async findAllAdmin(
    @Query() query: OrderQueryDto,
  ): Promise<ApiResponse<ResponseListDto<OrderDto[]>>> {
    const result = await this.orderService.findAllAdmin(query);
    return ApiResponse.success(result, 'Get all orders successfully');
  }

  @Get('admin/detail/:id')
  @Permissions('ORD_L')
  @ApiOperation({ summary: 'Admin: Get detail of any order' })
  async getDetailAdmin(@Param('id') id: string): Promise<ApiResponse<OrderDto>> {
    const order = await this.orderService.getOrderDetailAdmin(id);
    return ApiResponse.success(order, 'Get order detail successfully');
  }

  @Put('admin/update-status')
  @Permissions('ORD_U') // Quyền cập nhật trạng thái đơn hàng
  @ApiOperation({ summary: 'Admin: Update order status (Confirm, Shipping, etc.)' })
  async updateStatus(@Body() dto: UpdateOrderStatusDto): Promise<ApiResponse<void>> {
    await this.orderService.updateStatus(dto);
    return ApiResponse.successMessage('Order status updated successfully');
  }

  // --- VNPAY CALLBACK (Webhook) ---
  @Public()
  @Get('vnpay-ipn')
  @ApiOperation({ summary: 'VNPAY IPN Callback' })
  async handleIpn(@Query() query: any) {
    return await this.orderService.handleVnPayIpn(query);
  }

  @Public()
  @Get('vnpay-verify')
  @ApiOperation({ summary: 'VNPAY IPN verify' })
  async verifyPayment(@Query() query: any) {
    const result = await this.orderService.handleVnPayIpn(query);
    return {
      success: result.RspCode === '00',
      message: result.Message,
      code: result.RspCode,
    };
  }
}
