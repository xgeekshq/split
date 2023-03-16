import BoardDto from 'src/modules/boards/dto/board.dto';
import BoardUserDto from 'src/modules/boardusers/dto/board.user.dto';
import { TeamDto } from '../../communication/dto/team.dto';

export interface CreateBoardDto {
	maxUsers: number;
	board: BoardDto;
	team: TeamDto | null;
	users: BoardUserDto[];
}
