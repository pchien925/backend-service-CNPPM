import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Food } from './food.entity';
import { Option } from 'src/modules/option/entities/option.entity';

@Entity({ name: 'tbl_food_option' })
export class FoodOption extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'ordering', type: 'int', default: 0 })
  ordering!: number;

  @Column({
    name: 'requirement_type',
    type: 'int',
    default: 1,
    comment: '0: optional, 1: required',
  })
  requirementType!: number;

  @Column({ name: 'max_select', type: 'int', default: 1 })
  maxSelect!: number;

  @ManyToOne(() => Food, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food!: Food;

  @ManyToOne(() => Option, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_id' })
  option!: Option;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
