import { LoginGuestUserResponse } from './../../../../libs/dto/response/login-guest-user.response';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import User from 'src/modules/users/entities/user.schema';

export interface RegisterAuthServiceInterface {
	register(registrationData: CreateUserDto): Promise<User>;
	createGuest(guestUserData: CreateGuestUserDto): Promise<LoginGuestUserResponse>;
}
