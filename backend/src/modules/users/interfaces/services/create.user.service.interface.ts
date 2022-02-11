import CreateUserDto from '../../dto/createUser.dto';
import { UserDocument } from '../../schemas/user.schema';

export interface CreateUserService {
  create(user: CreateUserDto): Promise<UserDocument>;
}
