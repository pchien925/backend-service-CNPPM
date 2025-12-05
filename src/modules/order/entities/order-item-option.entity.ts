import { Auditable } from 'src/database/entities/abstract.entity';
import { OptionValue } from 'src/modules/option/entities/option-value.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'tbl_order_item_option' })
export class OrderItemOption extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({
    name: 'extra_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Extra price due to this option selection',
  })
  extraPrice!: number;

  @ManyToOne(() => OrderItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem!: OrderItem;

  @ManyToOne(() => OptionValue)
  @JoinColumn({ name: 'option_value_id' })
  optionValue!: OptionValue;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
