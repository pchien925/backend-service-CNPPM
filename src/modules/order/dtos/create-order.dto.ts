import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 2, description: '1: Pickup, 2: Delivery' })
  @IsEnum([1, 2])
  type: number;

  @ApiProperty({ description: 'Required if type is Delivery' })
  @IsOptional()
  @IsString()
  deliveryAddressId?: string;

  @ApiProperty({ description: 'Required for pickup or stock management' })
  @IsNotEmpty()
  @IsString()
  branchId: string;

  @ApiProperty({ example: 'Giao hàng sau 6h tối' })
  @IsOptional()
  @IsString()
  note?: string;
}
