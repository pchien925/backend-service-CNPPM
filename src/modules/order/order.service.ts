import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemOption } from './entities/order-item-option.entity';
import { OrderItemComboSelection } from './entities/order-item-combo-selection.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { UserContextHelper } from 'src/shared/context/user-context.helper';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { CreateOrderDto } from './dtos/create-order.dto';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ErrorCode } from 'src/constants/error-code.constant';
import { Address } from '../address/entities/address.entity';
import { Branch } from '../branch/entities/branch.entity';
import { Account } from '../account/entities/account.entity';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import * as qs from 'qs';

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
          throw new BadRequestException('Delivery address is required for delivery type');
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
        throw new BadRequestException('Cart is empty');
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
      return {
        order: savedOrder,
        paymentUrl: paymentUrl,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMyOrders() {
    const userId = UserContextHelper.getId();
    return this.orderRepo.find({
      where: { account: { id: userId } },
      order: { createdDate: 'DESC' },
      relations: ['branch', 'deliveryAddress'],
    });
  }

  async getOrderDetail(id: string) {
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

    if (!order) {
      throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }
    return order;
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
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = order.code;
    vnp_Params['vnp_OrderInfo'] = `Order ${order.code}`;
    vnp_Params['vnp_OrderType'] = 'other';
    const totalAmount = Number(order.subAmount) + Number(order.shippingFee);
    vnp_Params['vnp_Amount'] = Math.round(totalAmount * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr === '::1' ? '127.0.0.1' : ipAddr; // Fix IPv6
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(signData, 'utf-8').digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;

    // 4. Trả về URL cuối cùng
    return vnpUrl + '?' + qs.stringify(vnp_Params, { encode: true });
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();

    keys.forEach(key => {
      sorted[key] = obj[key];
    });

    return sorted;
  }
  async handleVnPayIpn(params: any) {
    const secureHash = params['vnp_SecureHash'];
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedParams = this.sortObject(params);
    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderCode = params['vnp_TxnRef'];
      const responseCode = params['vnp_ResponseCode'];

      const order = await this.orderRepo.findOne({ where: { code: orderCode } });
      if (!order) return { RspCode: '01', Message: 'Order not found' };

      if (responseCode === '00') {
        // Thanh toán thành công
        order.paymentStatus = 2; // Paid
        order.orderStatus = 2; // Success (hoặc chờ xử lý tiếp)
        await this.orderRepo.save(order);
        return { RspCode: '00', Message: 'Success' };
      } else {
        // Thanh toán thất bại
        order.paymentStatus = 3; // Failed/Refunded
        await this.orderRepo.save(order);
        return { RspCode: '00', Message: 'Payment Failed' };
      }
    } else {
      return { RspCode: '97', Message: 'Invalid signature' };
    }
  }
}
