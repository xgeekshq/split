import { LeanDocument } from 'mongoose';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { UserDocument } from 'src/modules/users/entities/user.schema';

export interface RegisterAuthApplication {
	register(registrationData: CreateUserDto): Promise<LeanDocument<UserDocument>>;
}
