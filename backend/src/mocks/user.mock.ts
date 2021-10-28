import { UserEntity } from 'src/users/entity/user.entity';
import { ObjectId } from 'mongodb';

export const mockedUser: UserEntity = {
  _id: ObjectId(1),
  email: 'user@email.com',
  username: 'John',
  password: 'hash',
};
