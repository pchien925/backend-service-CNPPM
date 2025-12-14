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
import { Combo } from './combo.entity';
import { ComboGroupItem } from './combo-group-item.entity';

@Entity({ name: 'tbl_combo_group' })
export class ComboGroup extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'name', length: 255 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'min_select', type: 'int', default: 0 })
  minSelect!: number;

  @Column({ name: 'max_select', type: 'int', default: 1 })
  maxSelect!: number;

  @Column({ name: 'ordering', type: 'int', default: 0 })
  ordering!: number;

  @ManyToOne(() => Combo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'combo_id' })
  combo!: Combo;

  @OneToMany(() => ComboGroupItem, item => item.comboGroup)
  items?: ComboGroupItem[];

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
