import { Auditable } from 'src/database/entities/abstract.entity';
import { Account } from 'src/modules/account/entities/account.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { Branch } from 'src/modules/branch/entities/branch.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'tbl_order' })
export class Order extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'code', length: 50, unique: true })
  code!: string;

  @Column({ name: 'type', type: 'int', default: 1, comment: '1: pickup, 2: delivery' })
  type!: number;

  @Column({ name: 'sub_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  subAmount!: number;

  @Column({ name: 'shipping_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingFee!: number;

  @Column({
    name: 'order_status',
    type: 'int',
    default: 1,
    comment: '1: pending, 2: success, 3: failed, 4: refunded',
  })
  orderStatus!: number;

  @Column({
    name: 'payment_status',
    type: 'int',
    default: 1,
    comment: '1: unpaid, 2: paid, 3: refunded',
  })
  paymentStatus!: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'cancel_at', type: 'timestamp', nullable: true })
  cancelAt?: Date;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason?: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'delivery_address_id' })
  deliveryAddress!: Address;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch!: Branch;

  @OneToMany(() => OrderItem, item => item.order)
  items!: OrderItem[];

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
