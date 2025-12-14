import { IsInt, IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_nation' })
export class Nation extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @Column({ name: 'name', length: 255 })
  @IsNotEmpty()
  name!: string;

  @Column({ name: 'postal_code', length: 50, nullable: true })
  postalCode?: string;

  @Column({ name: 'kind', type: 'int', default: 1, comment: '1: ward, 2: district, 3: province' })
  @IsInt()
  kind!: number;

  @ManyToOne(() => Nation, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Nation;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
