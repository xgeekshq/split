import { LeanDocument } from 'mongoose';
import CreateUserDto from '../../../users/dto/create.user.dto';
import { UserDocument } from '../../../users/schemas/user.schema';

export interface RegisterAuthApplication {
  register(
    registrationData: CreateUserDto,
  ): Promise<LeanDocument<UserDocument>>;
}
