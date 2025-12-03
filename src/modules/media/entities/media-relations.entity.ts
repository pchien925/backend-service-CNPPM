import { IsInt, IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Media } from './media.entity';

@Entity({ name: 'tbl_media_relations' })
export class MediaRelations extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  // ManyToOne relationship to Media
  @ManyToOne(() => Media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media!: Media;

  @Column({
    name: 'related_id',
    type: 'bigint',
    comment: 'ID of the related Entity (Food ID, Combo ID, etc.)',
  })
  @IsNotEmpty({ message: 'Related ID is required' })
  relatedId!: number;

  @Column({
    name: 'related_type',
    length: 255,
    comment: 'Name of the related Entity (e.g., Food, Combo)',
  })
  @IsNotEmpty({ message: 'Related type is required' })
  relatedType!: string;

  @Column({ name: 'ordering', type: 'int', default: 0 })
  @IsInt()
  ordering!: number;

  @Column({ name: 'kind', type: 'int', default: 1, comment: '1: main, 2: banner, 3: logo' })
  @IsInt()
  kind!: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
