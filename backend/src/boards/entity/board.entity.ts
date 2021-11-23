import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import UserEntity from '../../users/entity/user.entity';
import ColumnEntity from './column.entity';

@Entity('boards')
export default class BoardEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column()
  createdBy: UserEntity;

  @Column({ array: true, nullable: false })
  columns: ColumnEntity[];

  @Column()
  locked: boolean;

  @Column({ nullable: true })
  password: string;
}
