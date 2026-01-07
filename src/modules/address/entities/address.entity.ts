import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { Account } from 'src/modules/account/entities/account.entity';
import { Nation } from 'src/modules/nation/entities/nation.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_address' })
export class Address extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'recipient_name', length: 255 })
  @IsNotEmpty()
  recipientName!: string;

  @Column({ name: 'phone', length: 20 })
  phone!: string;

  @Column({ name: 'address_line', length: 500 })
  addressLine!: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  @IsBoolean()
  isDefault: boolean = false;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  // ManyToOne: Phường/Xã
  @ManyToOne(() => Nation)
  @JoinColumn({ name: 'ward_id' })
  ward!: Nation;

  // ManyToOne: Quận/Huyện
  @ManyToOne(() => Nation)
  @JoinColumn({ name: 'district_id' })
  district!: Nation;

  // ManyToOne: Tỉnh/Thành phố
  @ManyToOne(() => Nation)
  @JoinColumn({ name: 'province_id' })
  province!: Nation;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
