import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { UserContextHelper } from 'src/shared/context/user-context.helper';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Address } from '../address/entities/address.entity';
import { Branch } from '../branch/entities/branch.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { OrderItemComboSelection } from './entities/order-item-combo-selection.entity';
import { OrderItemOption } from './entities/order-item-option.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderMapper } from './order.mapper';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { OrderSpecification } from './specification/order.specification';
import { OrderQueryDto } from './dtos/order-query.dto';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
  ) {}

  async checkout(dto: CreateOrderDto, ipAddr: string) {
    const userId = UserContextHelper.getId();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const account = await this.accountRepo.findOneBy({ id: userId });
      if (!account) {
        throw new NotFoundException('Account not found', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
      }

      const branch = await this.branchRepo.findOneBy({ id: dto.branchId });
      if (!branch) {
        throw new NotFoundException('Branch not found', ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
      }
      let deliveryAddress = null;
      if (dto.type === 2) {
        if (!dto.deliveryAddressId) {
          throw new BadRequestException(
            'Delivery address is required for delivery orders',
            ErrorCode.DELIVERY_ADDRESS_REQUIRED,
          );
        }

        deliveryAddress = await this.addressRepo.findOne({
          where: {
            id: dto.deliveryAddressId,
            account: { id: userId },
          },
        });

        if (!deliveryAddress) {
          throw new NotFoundException(
            'Delivery address not found or does not belong to your account',
            ErrorCode.ADDRESS_ERROR_NOT_FOUND,
          );
        }
      }
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { account: { id: userId } },
      });

      if (!cart || Number(cart.totalPrice) <= 0) {
        throw new BadRequestException('Cart is empty', ErrorCode.CART_EMPTY);
      }

      const cartItems = await queryRunner.manager.find(CartItem, {
        where: { cart: { id: cart.id } },
        relations: [
          'options',
          'options.optionValue',
          'comboSelections',
          'comboSelections.selectedFood',
        ],
      });

      // 2. Tạo thực thể Order
      const order = queryRunner.manager.create(Order, {
        code: `ORD-${Date.now()}`,
        type: dto.type,
        subAmount: cart.totalPrice,
        shippingFee: dto.type === 2 ? 15000 : 0,
        totalAmount: Number(cart.totalPrice) + (dto.type === 2 ? 15000 : 0),
        orderStatus: 1, // Pending
        paymentStatus: 1, // Unpaid
        note: dto.note,
        account: account,
        branch: branch,
        deliveryAddress: deliveryAddress,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // 3. Chuyển CartItems sang OrderItems
      for (const cItem of cartItems) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          itemKind: cItem.itemKind,
          itemId: cItem.itemId,
          quantity: cItem.quantity,
          basePrice: cItem.basePrice,
          note: cItem.note,
        });
        const savedOrderItem = await queryRunner.manager.save(orderItem);

        // Chuyển Options nếu có
        if (cItem.options?.length) {
          const orderOptions = cItem.options.map(opt =>
            queryRunner.manager.create(OrderItemOption, {
              orderItem: savedOrderItem,
              optionValue: opt.optionValue,
              extraPrice: opt.extraPrice,
            }),
          );
          await queryRunner.manager.save(orderOptions);
        }

        // Chuyển Combo Selections nếu có
        if (cItem.comboSelections?.length) {
          const orderSelections = cItem.comboSelections.map(sel =>
            queryRunner.manager.create(OrderItemComboSelection, {
              orderItem: savedOrderItem,
              selectedFood: sel.selectedFood,
              extraPrice: sel.extraPrice,
            }),
          );
          await queryRunner.manager.save(orderSelections);
        }
      }

      // 4. Xóa giỏ hàng sau khi checkout thành công
      await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } });
      await queryRunner.manager.update(Cart, cart.id, { totalPrice: 0 });
      const paymentUrl = this.createVnPayUrl(savedOrder, ipAddr);

      await queryRunner.commitTransaction();
      return paymentUrl;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllAdmin(query: OrderQueryDto): Promise<ResponseListDto<OrderDto[]>> {
    const { page = 0, limit = 10 } = query;

    const [entities, total] = await this.orderRepo.findAndCount({
      where: new OrderSpecification(query).toWhere(),
      relations: ['branch', 'deliveryAddress', 'account'],
      order: { createdDate: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    return new ResponseListDto(OrderMapper.toResponseList(entities), total, limit);
  }

  async getOrderDetailAdmin(id: string): Promise<OrderDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: [
        'branch',
        'deliveryAddress',
        'account',
        'items',
        'items.options',
        'items.options.optionValue',
        'items.comboSelections',
        'items.comboSelections.selectedFood',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }

    return OrderMapper.toResponse(order);
  }

  /**
   * ADMIN: Cập nhật trạng thái đơn hàng
   */
  async updateStatus(dto: UpdateOrderStatusDto): Promise<void> {
    const order = await this.orderRepo.findOneBy({ id: dto.id });
    if (!order) throw new NotFoundException('Order not found');

    order.orderStatus = dto.orderStatus;
    await this.orderRepo.save(order);
  }

  /**
   * USER: Cập nhật hàm getMyOrders để dùng Mapper
   */
  async getMyOrders(): Promise<OrderDto[]> {
    const userId = UserContextHelper.getId();
    const entities = await this.orderRepo.find({
      where: { account: { id: userId } },
      order: { createdDate: 'DESC' },
      relations: ['branch', 'deliveryAddress'],
    });
    return OrderMapper.toResponseList(entities);
  }

  /**
   * USER: Cập nhật hàm getOrderDetail để dùng Mapper
   */
  async getOrderDetail(id: string): Promise<OrderDto> {
    const userId = UserContextHelper.getId();
    const order = await this.orderRepo.findOne({
      where: { id, account: { id: userId } },
      relations: [
        'branch',
        'deliveryAddress',
        'items',
        'items.options',
        'items.options.optionValue',
        'items.comboSelections',
        'items.comboSelections.selectedFood',
      ],
    });

    if (!order) throw new NotFoundException('Order not found');
    return OrderMapper.toResponse(order);
  }

  async cancelOrder(id: string, reason: string) {
    const userId = UserContextHelper.getId();
    const order = await this.orderRepo.findOne({
      where: { id, account: { id: userId } },
    });

    if (!order) {
      throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }

    // Only allow cancellation if order status is Pending (1)
    if (order.orderStatus !== 1) {
      throw new BadRequestException(
        'Only pending orders can be cancelled',
        ErrorCode.ORDER_CANNOT_CANCEL,
      );
    }

    order.orderStatus = 3; // Cancelled
    order.cancelAt = new Date();
    order.cancelReason = reason;

    return this.orderRepo.save(order);
  }
  private createVnPayUrl(order: Order, ipAddr: string): string {
    const createDate = dayjs().format('YYYYMMDDHHmmss');
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const totalAmount = Number(order.subAmount) + Number(order.shippingFee);
    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order.code,
      vnp_OrderInfo: `Thanh toan don hang ${order.code}`,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(totalAmount * 100),
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_IpAddr: ipAddr === '::1' ? '127.0.0.1' : ipAddr,
      vnp_CreateDate: createDate,
    };

    const sortedKeys = Object.keys(vnp_Params).sort();

    const signData = new URLSearchParams();
    sortedKeys.forEach(key => {
      signData.append(key, vnp_Params[key].toString());
    });

    const signDataString = signData.toString();

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signDataString, 'utf-8')).digest('hex');

    return `${vnpUrl}?${signDataString}&vnp_SecureHash=${signed}`;
  }

  async handleVnPayIpn(params: any) {
    const vnp_SecureHash = params['vnp_SecureHash'];
    const data = { ...params };
    delete data['vnp_SecureHash'];
    delete data['vnp_SecureHashType'];

    const signData = new URLSearchParams();
    Object.keys(data)
      .sort()
      .forEach(key => {
        if (data[key]) signData.append(key, data[key].toString());
      });

    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData.toString(), 'utf-8')).digest('hex');

    if (vnp_SecureHash !== signed) {
      return {
        RspCode: '97',
        Message: 'Invalid signature',
        ErrorCode: ErrorCode.VNPAY_INVALID_SIGNATURE,
      };
    }

    const order = await this.orderRepo.findOne({ where: { code: params['vnp_TxnRef'] } });
    if (!order) {
      return {
        RspCode: '01',
        Message: 'Order not found',
        ErrorCode: ErrorCode.VNPAY_ORDER_NOT_FOUND,
      };
    }

    const dbTotalAmount = (Number(order.subAmount) + Number(order.shippingFee)) * 100;
    const vnpAmount = Number(params['vnp_Amount']);

    if (Math.round(dbTotalAmount) !== vnpAmount) {
      return {
        RspCode: '04',
        Message: 'Amount mismatch',
        ErrorCode: ErrorCode.VNPAY_AMOUNT_MISMATCH,
      };
    }

    if (params['vnp_ResponseCode'] === '00') {
      if (order.paymentStatus !== 2) {
        order.paymentStatus = 2; // Paid
        order.orderStatus = 2; // Success/Confirmed
        await this.orderRepo.save(order);
      }
      return {
        RspCode: '00',
        Message: 'Payment successful',
      };
    } else {
      order.paymentStatus = 3; // Failed
      await this.orderRepo.save(order);
      return {
        RspCode: '00',
        Message: 'Payment failed and has been recorded',
        ErrorCode: ErrorCode.VNPAY_PAYMENT_FAILED,
      };
    }
  }
}
