import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';

export interface BoardRepositoryInterface extends BaseInterfaceRepository<Board> {
	getBoard(boardId: string): Promise<Board>;
	getBoardPopulated(boardId: string): Promise<Board>;
	getMainBoard(boardId: string): Promise<Board>;
	getBoardData(boardId: string): Promise<Board>;
	getAllBoardsByTeamId(teamId: string): Promise<Board[]>;
	countBoards(boardIds: string[], teamIds: string[]): Promise<number>;
}
