import BoardDto from 'src/modules/boards/dto/board.dto';
import BoardUserDto from 'src/modules/boards/dto/board.user.dto';
import { TeamDto } from './team.dto';

export interface CreateBoardDto {
	maxUsers: number;
	board: BoardDto;
	team: TeamDto | null;
	users: BoardUserDto[];
}
