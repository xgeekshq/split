import { LeanDocument } from 'mongoose';

import CreateUserDto from 'modules/users/dto/create.user.dto';
import { UserDocument } from 'modules/users/schemas/user.schema';

export interface RegisterAuthApplication {
	register(registrationData: CreateUserDto): Promise<LeanDocument<UserDocument>>;
}
