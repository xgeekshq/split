import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import User from 'src/modules/users/entities/user';

export interface RegisterAuthService {
	register(registrationData: CreateUserDto): Promise<User>;
}
