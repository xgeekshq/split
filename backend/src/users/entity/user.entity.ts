import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ObjectId } from 'mongodb';

@Entity('users')
class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column({ nullable: false }) name: string;
  @Column({ nullable: false }) password: string;
  @Column({ nullable: false, unique: true }) email: string;
  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;
  @Exclude()
  @Column()
  public currentHashedRefreshToken?: string;
}

export default UserEntity;
