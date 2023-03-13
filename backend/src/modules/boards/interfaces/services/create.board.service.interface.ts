import BoardDto from '../../dto/board.dto';
import { Configs } from '../../dto/configs.dto';
import Board from '../../entities/board.schema';

export interface CreateBoardServiceInterface {
	create(boardData: BoardDto, userId: string): Promise<Board>;

	splitBoardByTeam(ownerId: string, teamId: string, configs: Configs): Promise<string | null>;
}
