import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import BoardUserDto from 'src/modules/boards/dto/board.user.dto';

export default class UpdateBoardUserDto {
	@ApiProperty({ description: 'List of users to add on board' })
	@IsArray()
	addBoardUsers!: BoardUserDto[];

	@ApiProperty({ description: 'List of board user ids to remove from board' })
	@IsArray()
	removeBoardUsers!: string[];

	@ApiPropertyOptional()
	@IsOptional()
	boardUserToUpdate?: BoardUserDto;
}
