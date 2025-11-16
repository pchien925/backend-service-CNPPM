import { Entity, PrimaryColumn, Column, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';

@Entity({ name: `tbl_group` })
export class Group extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'name', unique: true, length: 255 })
  @IsNotEmpty({ message: 'Group name is required' })
  name!: string;

  @Column({ name: 'kind', type: 'int', default: 0 })
  @IsInt()
  kind!: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_system_role', type: 'boolean', default: false })
  isSystemRole: boolean = false;

  @ManyToMany(() => Permission, permission => permission.groups, {
    cascade: ['insert', 'update'],
    eager: false,
  })
  @JoinTable({
    name: `tbl_permission_group`,
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions?: Permission[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = new SnowflakeValueGenerator().generate(this);
    }
  }
}
