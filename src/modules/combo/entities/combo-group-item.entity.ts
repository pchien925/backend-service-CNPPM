import { Auditable } from 'src/database/entities/abstract.entity';
import { Food } from 'src/modules/food/entities/food.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ComboGroup } from './combo-group.entity';

@Entity({ name: 'tbl_combo_group_item' })
export class ComboGroupItem extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'extra_price', type: 'int', default: 0 })
  extraPrice!: number;

  @Column({ name: 'ordering', type: 'int', default: 0 })
  ordering!: number;

  @ManyToOne(() => ComboGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'combo_group_id' })
  comboGroup!: ComboGroup;

  @ManyToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food!: Food;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
