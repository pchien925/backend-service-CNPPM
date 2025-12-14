import { IsInt, IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ReuseId {
  reusedId?: string;
}

export abstract class Auditable<T> extends ReuseId {
  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'admin',
  })
  @IsNotEmpty()
  createdBy!: T;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    nullable: false,
  })
  createdDate!: Date;

  @Column({
    name: 'modified_by',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'admin',
  })
  @IsNotEmpty()
  modifiedBy!: T;

  @UpdateDateColumn({
    name: 'modified_date',
    type: 'timestamp',
    nullable: false,
  })
  modifiedDate!: Date;

  @Column({
    name: 'status',
    type: 'tinyint',
    default: 1,
    width: 1,
  })
  @IsInt()
  status: number = 1;
}
