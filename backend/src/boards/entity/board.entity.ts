import UserEntity from '../../users/entity/user.entity';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import ColumnEntity from './column.entity';
import { ObjectId } from 'mongodb';

@Entity('boards')
class BoardEntity {
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

export default BoardEntity;
