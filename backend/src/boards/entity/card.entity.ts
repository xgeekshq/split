import { Column, Entity } from 'typeorm';
import { Content } from './content';

@Entity('cards')
class CardEntity extends Content {
  @Column({ nullable: false })
  createdBy: string;
  @Column({ nullable: false })
  likes: number;
}

export default CardEntity;
