// src/rbac/entities/permission.entity.ts
import { Entity, PrimaryColumn, Column, BeforeInsert, ManyToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { SnowflakeValueGenerator } from 'src/common/id/snowflake-value.generator';
import { Group } from 'src/modules/group/entities/group.entity';

@Entity({ name: `tbl_permission` })
export class Permission extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ name: 'name', unique: true, length: 255 })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @Column({ name: 'action', nullable: true, length: 255 })
  action?: string;

  @Column({ name: 'show_menu', type: 'boolean', default: false })
  showMenu: boolean = false;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'name_group', length: 255, nullable: true })
  nameGroup?: string;

  @Column({ name: 'p_code', unique: true, length: 100 })
  @IsNotEmpty({ message: 'Permission code is required' })
  permissionCode!: string;

  @ManyToMany(() => Group, group => group.permissions)
  groups?: Group[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = new SnowflakeValueGenerator().generate(this);
    }
  }
}
