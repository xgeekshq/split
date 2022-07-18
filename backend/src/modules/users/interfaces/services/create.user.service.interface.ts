import { LeanDocument } from 'mongoose';

import CreateUserAzureDto from '../../dto/create.user.azure.dto';
import CreateUserDto from '../../dto/create.user.dto';
import { UserDocument } from '../../schemas/user.schema';

export interface CreateUserService {
	create(user: CreateUserDto | CreateUserAzureDto): Promise<LeanDocument<UserDocument>>;
}
