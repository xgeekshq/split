import { LeanDocument } from 'mongoose';
import CreateUserDto from '../../dto/create.user.dto';
import { UserDocument } from '../../schemas/user.schema';

export interface CreateUserService {
  create(user: CreateUserDto): Promise<LeanDocument<UserDocument>>;
}
