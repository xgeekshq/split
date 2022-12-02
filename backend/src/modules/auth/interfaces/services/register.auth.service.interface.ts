import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import UserModel from 'src/modules/users/entities/user';

export interface RegisterAuthService {
	register(registrationData: CreateUserDto): Promise<UserModel>;
}
