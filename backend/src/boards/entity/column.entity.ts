import { Column, Entity } from 'typeorm';
import { Content } from './content';
import CardEntity from './card.entity';

@Entity('columns')
class ColumnEntity extends Content {
  @Column({ nullable: false })
  color: string;
  @Column((type) => CardEntity)
  @Column({ array: true, nullable: false })
  cards: Array<CardEntity>;
}

export default ColumnEntity;
