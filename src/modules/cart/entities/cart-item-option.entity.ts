import { Auditable } from 'src/database/entities/abstract.entity';
import { OptionValue } from 'src/modules/option/entities/option-value.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity({ name: 'tbl_cart_item_option' })
export class CartItemOption extends Auditable<string> {
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

  @ManyToOne(() => CartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_item_id' })
  cartItem!: CartItem;

  @ManyToOne(() => OptionValue)
  @JoinColumn({ name: 'option_value_id' })
  optionValue!: OptionValue;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
