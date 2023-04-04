import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import BoardGuestUserDto from 'src/modules/boardUsers/dto/board.guest.user.dto';
import UserDto from 'src/modules/users/dto/user.dto';

export default class GetBoardUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	boardId: string;

	@ApiProperty({ type: UserDto })
	user: UserDto;

	completionHandler?: (boardUser: BoardGuestUserDto) => void;
}
