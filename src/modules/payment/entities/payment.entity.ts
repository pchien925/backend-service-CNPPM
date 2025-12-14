import { IsInt } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_payment' })
export class Payment extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({
    name: 'refund_by',
    length: 255,
    nullable: true,
    comment: 'User or system that initiated the refund',
  })
  refundBy?: string;

  @Column({ name: 'code', length: 50, unique: true })
  code!: string;

  @Column({ name: 'payment_method', type: 'int', default: 1, comment: '1: cash, 2: transfer' })
  @IsInt()
  paymentMethod!: number;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({
    name: 'status',
    type: 'int',
    default: 1,
    comment: '1: pending, 2: success, 3: failed, 4: refunded',
  })
  @IsInt()
  status!: number;

  @Column({ name: 'gateway_transaction_id', length: 255, nullable: true })
  gatewayTransactionId?: string;

  @Column({
    name: 'gateway_response_json',
    type: 'json',
    nullable: true,
    comment: 'Raw response data from payment gateway',
  })
  gatewayResponseJson?: any;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount?: number;

  @Column({ name: 'refund_reason', type: 'text', nullable: true })
  refundReason?: string;

  @Column({ name: 'refund_at', type: 'timestamp', nullable: true })
  refundAt?: Date;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
