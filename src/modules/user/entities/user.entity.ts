import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum Gender {
  'WOMEN' = 0,
  'MAN' = 1,
  'UNKNOWN' = 2,
}
export enum IsShow {
  '隐藏' = 0,
  '展示' = 1,
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: string;

  @Column({
    type: 'enum',
    enum: IsShow,
    default: 1,
  })
  showDelete: number;

  @Column({
    type: 'enum',
    enum: Gender,
    default: 2,
  })
  gender: number;
}
