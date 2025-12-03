import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_media' })
export class Media extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'url', length: 500 })
  url!: string;

  @Column({ name: 'kind', type: 'int', default: 1, comment: '1: image, 2: video, 3: pdf' })
  kind!: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
