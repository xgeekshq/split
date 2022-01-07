import { Column } from 'typeorm';
import UserEntity from '../../users/entity/user.entity';

export default class CardEntity {
  @Column({ unique: true })
  _id?: string;

  @Column({ nullable: false })
  text!: string;

  @Column({ nullable: false })
  createdBy!: UserEntity;

  @Column({ nullable: false })
  likes!: number;
}
