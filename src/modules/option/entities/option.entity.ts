import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';

@Entity({ name: 'tbl_option' })
export class Option extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'name', length: 255 })
  @IsNotEmpty()
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
