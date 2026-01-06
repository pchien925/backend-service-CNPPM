import { Order } from './entities/order.entity';
import { OrderDto } from './dtos/order.dto';

export class OrderMapper {
  static toResponse(entity: Order): OrderDto {
    if (!entity) return null;

    return {
      id: entity.id,
      code: entity.code,
      type: entity.type,
      subAmount: Number(entity.subAmount),
      shippingFee: Number(entity.shippingFee),
      totalAmount: Number(entity.subAmount) + Number(entity.shippingFee),
      orderStatus: entity.orderStatus,
      paymentStatus: entity.paymentStatus,
      note: entity.note,
      branchName: entity.branch?.name,
      deliveryAddressFull: entity.deliveryAddress
        ? `${entity.deliveryAddress.addressLine}, ${entity.deliveryAddress.ward}`
        : null,
      createdDate: (entity as any).createdDate,
      items:
        entity.items?.map(item => ({
          id: item.id,
          itemKind: item.itemKind,
          itemId: item.itemId,
          quantity: item.quantity,
          basePrice: Number(item.basePrice),
          note: item.note,
          options:
            item.options?.map(opt => ({
              id: opt.id,
              extraPrice: Number(opt.extraPrice),
              optionValueName: opt.optionValue?.name,
            })) || [],
          comboSelections:
            item.comboSelections?.map(sel => ({
              id: sel.id,
              extraPrice: Number(sel.extraPrice),
              foodName: sel.selectedFood?.name,
            })) || [],
        })) || [],
    };
  }

  static toResponseList(entities: Order[]): OrderDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
