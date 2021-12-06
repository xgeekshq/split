import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import UserEntity from '../../users/entity/user.entity';
import ColumnEntity from './column.entity';
import CardEntity from './card.entity';

@Entity('boards')
export default class BoardEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  createdBy!: UserEntity;

  @Column({ array: true, nullable: false })
  columns!: ColumnEntity[];

  @Column({ nullable: false })
  locked!: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: false })
  columnsOrder!: string[];

  @Column({ array: true, nullable: false })
  cards!: CardEntity[];
}
