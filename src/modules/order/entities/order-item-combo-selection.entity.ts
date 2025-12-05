import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Food } from 'src/modules/food/entities/food.entity';

@Entity({ name: 'tbl_order_item_combo_selection' })
export class OrderItemComboSelection extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({
    name: 'extra_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Extra price due to selecting this specific food item in the combo group',
  })
  extraPrice!: number;

  @ManyToOne(() => OrderItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem!: OrderItem;

  @ManyToOne(() => Food)
  @JoinColumn({ name: 'selected_food_id' })
  selectedFood!: Food;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
