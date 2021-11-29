import { Request } from 'express';
import UserEntity from '../users/entity/user.entity';

export default interface RequestWithUser extends Request {
  user: UserEntity;
}
