import UserEntity from '../../users/entity/user.entity';
import { Column } from 'typeorm';

class CardEntity {
  @Column()
  title: string;
  @Column()
  createdBy: UserEntity;
  @Column({ nullable: false })
  likes: number;
}

export default CardEntity;
