import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn()
  _id: string;
  @Column({ nullable: false }) username: string;
  @Column({ nullable: false }) password: string;
  @Column({ nullable: false, unique: true }) email: string;
  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;
}
