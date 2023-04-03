import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import UserDto from 'src/modules/users/dto/user.dto';

export default class GetBoardUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	boardId: string;

	@ApiProperty({ type: UserDto })
	user: UserDto;
}
