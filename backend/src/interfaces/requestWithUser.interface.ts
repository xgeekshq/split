import { Request } from 'express';
import UserDto from 'src/models/users/dto/user.dto';

export default interface RequestWithUser extends Request {
  user: UserDto;
}
