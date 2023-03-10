import BoardUser from 'src/modules/boards/entities/board.user.schema';
import BoardDto from '../../dto/board.dto';
import BoardUserDto from '../../dto/board.user.dto';
import { Configs } from '../../dto/configs.dto';
import Board from '../../entities/board.schema';

export interface CreateBoardServiceInterface {
	create(boardData: BoardDto, userId: string): Promise<Board>;

	splitBoardByTeam(ownerId: string, teamId: string, configs: Configs): Promise<string | null>;

	saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string): Promise<BoardUser[]>;
}
