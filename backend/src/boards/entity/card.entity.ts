import { Column } from 'typeorm';
import UserEntity from '../../users/entity/user.entity';

export default class CardEntity {
  @Column()
  title: string;

  @Column()
  createdBy: UserEntity;

  @Column({ nullable: false })
  likes: number;
}
