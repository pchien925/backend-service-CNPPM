import { IsInt } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
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
import { Cart } from './cart.entity';
import { CartItemOption } from './cart-item-option.entity';
import { CartItemComboSelection } from './cart-item-combo-selection.entity';

@Entity({ name: 'tbl_cart_item' })
export class CartItem extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'item_kind', type: 'int', default: 1, comment: '1: food, 2: combo' })
  @IsInt()
  itemKind!: number;

  @Column({ name: 'item_id', type: 'bigint', comment: 'ID of the Food or Combo' })
  itemId: string;

  @Column({ name: 'quantity', type: 'int' })
  @IsInt()
  quantity!: number;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => CartItemOption, option => option.cartItem)
  options!: CartItemOption[];

  @OneToMany(() => CartItemComboSelection, selection => selection.cartItem)
  comboSelections!: CartItemComboSelection[];

  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
