import UserDto from '../../dto/user.dto';

export interface DeleteUserApplicationInterface {
	delete(user: UserDto, userId: string): Promise<boolean>;
}
