import { LoginGuestUserResponse } from 'src/libs/dto/response/login-guest-user.response';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';

export interface RegisterGuestUserUseCaseInterface {
	execute(guestUserData: CreateGuestUserDto): Promise<LoginGuestUserResponse>;
}
