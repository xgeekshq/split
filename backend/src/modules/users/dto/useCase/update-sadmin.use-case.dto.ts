import { ApiProperty } from '@nestjs/swagger';
import UpdateUserDto from '../update.user.dto';
import UserDto from '../user.dto';

export default class UpdateSAdminUseCaseDto {
	@ApiProperty()
	user: UpdateUserDto;

	@ApiProperty()
	requestUser: UserDto;
}
