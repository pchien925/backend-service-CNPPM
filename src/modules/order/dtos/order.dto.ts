import { ApiProperty } from '@nestjs/swagger';

export class OrderItemOptionDto {
  @ApiProperty() id: string;
  @ApiProperty() extraPrice: number;
  @ApiProperty() optionValueName: string; // Lấy từ relation optionValue
}

export class OrderItemComboSelectionDto {
  @ApiProperty() id: string;
  @ApiProperty() extraPrice: number;
  @ApiProperty() foodName: string; // Lấy từ relation selectedFood
}

export class OrderItemDto {
  @ApiProperty() id: string;
  @ApiProperty() itemKind: number;
  @ApiProperty() itemId: string;
  @ApiProperty() quantity: number;
  @ApiProperty() basePrice: number;
  @ApiProperty() note?: string;
  @ApiProperty({ type: [OrderItemOptionDto] }) options: OrderItemOptionDto[];
  @ApiProperty({ type: [OrderItemComboSelectionDto] })
  comboSelections: OrderItemComboSelectionDto[];
}

export class OrderDto {
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiProperty() type: number;
  @ApiProperty() subAmount: number;
  @ApiProperty() shippingFee: number;
  @ApiProperty() totalAmount: number;
  @ApiProperty() orderStatus: number;
  @ApiProperty() paymentStatus: number;
  @ApiProperty() note?: string;
  @ApiProperty() branchName: string;
  @ApiProperty() deliveryAddressFull?: string;
  @ApiProperty({ type: [OrderItemDto] }) items: OrderItemDto[];
  @ApiProperty() createdDate: Date;
}

export class UpdateOrderStatusDto {
  @ApiProperty() id: string;
  @ApiProperty({ description: '1: pending, 2: success, 3: failed, 4: refunded' })
  orderStatus: number;
}
