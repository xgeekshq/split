import { Column, Entity } from 'typeorm';
import CardEntity from './card.entity';

class ColumnEntity {
  @Column()
  title: string;
  @Column({ nullable: false })
  color: string;
  @Column({ array: true, nullable: false })
  cards: CardEntity[];
}

export default ColumnEntity;
