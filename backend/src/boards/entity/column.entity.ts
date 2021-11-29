import { Column } from 'typeorm';
import CardEntity from './card.entity';

export default class ColumnEntity {
  @Column()
  title: string;

  @Column({ nullable: false })
  color: string;

  @Column({ array: true, nullable: false })
  cards: CardEntity[];
}
