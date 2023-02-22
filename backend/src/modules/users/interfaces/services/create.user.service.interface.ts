import CreateGuestUserDto from '../../dto/create.guest.user.dto';
import CreateUserAzureDto from '../../dto/create.user.azure.dto';
import CreateUserDto from '../../dto/create.user.dto';
import User from '../../entities/user.schema';

export interface CreateUserService {
	create(user: CreateUserDto | CreateUserAzureDto): Promise<User>;
	createGuest(guestUserData: CreateGuestUserDto): Promise<User>;
}
