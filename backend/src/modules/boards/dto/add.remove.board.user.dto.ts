import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import BoardUserDto from 'src/modules/boards/dto/board.user.dto';

export default class AddRemoveBoardUserDto {
	@ApiProperty({ description: 'List of users to add on board' })
	@IsArray()
	addBoardUsers!: BoardUserDto[];

	@ApiProperty({ description: 'List of board user ids to remove from board' })
	@IsArray()
	removeBoardUsers!: string[];
}
