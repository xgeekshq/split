import UpdateUserDto from '../../dto/update.user.dto';
import User from '../../entities/user.schema';
import UserDto from '../../dto/user.dto';

export interface UpdateSAdminUseCaseInterface {
	execute(user: UpdateUserDto, requestUser: UserDto): Promise<User>;
}
