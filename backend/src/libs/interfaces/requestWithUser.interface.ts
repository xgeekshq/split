import { Request } from 'express';
import UserDto from 'src/modules/users/dto/user.dto';

export default interface RequestWithUser extends Request {
  user: UserDto;
}
