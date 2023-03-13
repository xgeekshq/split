import UserDto from '../../dto/user.dto';

export interface DeleteUserUseCaseInterface {
	execute(user: UserDto, userId: string): Promise<boolean>;
}
