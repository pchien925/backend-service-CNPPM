import { Auditable } from 'src/database/entities/abstract.entity';
import { Food } from 'src/modules/food/entities/food.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity({ name: 'tbl_cart_item_combo_selection' })
export class CartItemComboSelection extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({
    name: 'extra_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Extra price due to selecting this specific food item in the combo group',
  })
  extraPrice!: number;

  @ManyToOne(() => CartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_item_id' })
  cartItem!: CartItem;

  @ManyToOne(() => Food)
  @JoinColumn({ name: 'selected_food_id' })
  selectedFood!: Food;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
