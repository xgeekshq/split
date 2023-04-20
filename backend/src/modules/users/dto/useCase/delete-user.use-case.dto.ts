import UserDto from 'src/modules/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class DeleteUserUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@ApiProperty({ type: UserDto })
	@IsNotEmpty()
	user: UserDto;
}
