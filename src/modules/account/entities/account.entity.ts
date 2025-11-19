import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, IsEmail, IsBoolean, IsInt } from 'class-validator';
import { Auditable } from 'src/database/entities/abstract.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { SnowflakeValueGenerator } from 'src/shared/id/snowflake-value.generator';

@Entity({ name: `tbl_account` })
export class Account extends Auditable<string> {
  @PrimaryColumn({ type: 'bigint', unsigned: true, name: 'id' })
  id!: number;

  @Column({ name: 'kind', type: 'int' })
  @IsInt()
  kind!: number;

  @Column({ name: 'username', unique: true, length: 255 })
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'email', unique: true, length: 255 })
  @IsEmail({}, { message: 'Invalid email' })
  email!: string;

  @Column({ name: 'password', select: false })
  @IsNotEmpty()
  password!: string;

  @Column({ name: 'full_name', length: 255 })
  @IsNotEmpty()
  fullName!: string;

  @ManyToOne(() => Group, { nullable: true, eager: false })
  @JoinColumn({ name: 'group_id' })
  group?: Group;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({ name: 'avatar_path', nullable: true })
  avatarPath?: string;

  @Column({ name: 'reset_pwd_code', nullable: true })
  resetPwdCode?: string;

  @Column({ name: 'reset_pwd_time', type: 'timestamp', nullable: true })
  resetPwdTime?: Date;

  @Column({ name: 'attempt_forget_pwd', type: 'int', default: 0 })
  attemptCode: number = 0;

  @Column({ name: 'attempt_login', type: 'int', default: 0 })
  attemptLogin: number = 0;

  @Column({ name: 'is_super_admin', type: 'boolean', default: false })
  @IsBoolean()
  isSuperAdmin: boolean = false;

  @Column({ name: 'otp_code', nullable: true, length: 6 })
  otpCode?: string;

  @Column({ name: 'otp_expires_at', type: 'timestamp', nullable: true })
  otpExpiresAt?: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = new SnowflakeValueGenerator().generate(this);
    }
  }
}
