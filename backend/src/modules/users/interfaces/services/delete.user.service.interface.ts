import UserDto from '../../dto/user.dto';

export interface DeleteUserServiceInterface {
	delete(user: UserDto, userId: string): Promise<boolean>;
}
