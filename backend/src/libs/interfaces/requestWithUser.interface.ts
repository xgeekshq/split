import { Request } from 'express';

import UserDto from 'modules/users/dto/user.dto';

export default interface RequestWithUser extends Request {
	user: UserDto;
}
