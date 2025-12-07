import { Auditable } from 'src/database/entities/abstract.entity';
import { Category } from 'src/modules/category/entities/category.entity';
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
import { FoodOption } from './food-option.entity';
import { FoodTag } from './food-tag.entity';

@Entity({ name: 'tbl_food' })
export class Food extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'name', length: 255 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ name: 'cooking_time', type: 'int', nullable: true, comment: 'minutes' })
  cookingTime?: number;

  @Column({ name: 'ordering', type: 'int', default: 0 })
  ordering!: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany(() => FoodTag, foodTag => foodTag.food)
  foodTags?: FoodTag[];

  @OneToMany(() => FoodOption, foodOption => foodOption.food)
  foodOptions?: FoodOption[];

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
