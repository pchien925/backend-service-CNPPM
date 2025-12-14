import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';
import { BeforeInsert, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Combo } from './combo.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';

@Entity({ name: 'tbl_combo_tag' })
export class ComboTag extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unique: true })
  id!: string;

  @ManyToOne(() => Combo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'combo_id' })
  combo!: Combo;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag!: Tag;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = new SnowflakeValueGenerator().generate(this);
  }
}
