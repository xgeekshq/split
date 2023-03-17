import UserDto from 'src/modules/users/dto/user.dto';
import User from 'src/modules/users/entities/user.schema';

export interface SignInUseCaseInterface {
	execute(user: UserDto): Promise<Partial<User>>;
}
