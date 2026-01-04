import { Auditable } from 'src/database/entities/abstract.entity';
import { Account } from 'src/modules/account/entities/account.entity';
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
import { CartItem } from './cart-item.entity';

@Entity({ name: 'tbl_cart' })
export class Cart extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice!: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true })
  items!: CartItem[];

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
