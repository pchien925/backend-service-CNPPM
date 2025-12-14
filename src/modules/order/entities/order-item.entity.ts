import { IsInt } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'tbl_order_item' })
export class OrderItem extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'item_kind', type: 'int', default: 1, comment: '1: food, 2: combo' })
  @IsInt()
  itemKind!: number;

  @Column({ name: 'item_id', type: 'bigint', comment: 'ID of the Food or Combo' })
  itemid!: string;

  @Column({ name: 'quantity', type: 'int' })
  @IsInt()
  quantity!: number;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
