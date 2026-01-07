import { Entity, PrimaryColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { OptionValue } from './option-value.entity';

@Entity({ name: 'tbl_option' })
export class Option extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'name', length: 255 })
  @IsNotEmpty()
  name!: string;

  @Column({ name: 'image', length: 255, nullable: true })
  image?: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => OptionValue, value => value.option, {
    cascade: ['insert', 'update'],
    eager: false,
  })
  values?: OptionValue[];

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
