import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import ColumnEntity from './column.entity';
import { Content } from './content';

@Entity('boards')
class BoardEntity extends Content {
  @Column({ nullable: false })
  createdBy: string;
  @Column({ array: true })
  columns: ColumnEntity[];
  @Column()
  locked: boolean;
  @Column({ nullable: true })
  password: string;
}

export default BoardEntity;
