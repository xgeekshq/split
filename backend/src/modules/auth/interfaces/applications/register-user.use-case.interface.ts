import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import User from 'src/modules/users/entities/user.schema';

export interface RegisterUserUseCaseInterface {
	execute(registrationData: CreateUserDto): Promise<Partial<User>>;
}
