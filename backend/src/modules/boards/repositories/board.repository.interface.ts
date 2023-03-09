import { FilterQuery, ObjectId } from 'mongoose';
import { BoardPhases } from 'src/libs/enum/board.phases';
import {
	BaseInterfaceRepository,
	PopulateType
} from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';
import Column from 'src/modules/columns/entities/column.schema';
import { QueryType } from '../interfaces/findQuery';

export interface BoardRepositoryInterface extends BaseInterfaceRepository<Board> {
	getBoard(boardId: string): Promise<Board>;
	getBoardPopulated(boardId: string, populate?: PopulateType): Promise<Board>;
	getMainBoard(boardId: string): Promise<Board>;
	getMainBoardOfSubBoard(boardId: string): Promise<Board>;
	getBoardData(boardId: string): Promise<Board>;
	getAllBoardsByTeamId(teamId: string): Promise<Board[]>;
	countBoards(boardIds: (string | ObjectId)[], teamIds: string[]): Promise<number>;
	getCountPage(query: QueryType): Promise<number>;
	getAllBoards(
		allBoards: boolean,
		query: QueryType,
		page: number,
		size: number,
		count: number
	): Promise<Board[]>;
	getResponsiblesSlackId(boardId: string): Promise<Board>;
	getBoardByQuery(query: FilterQuery<any>): Promise<Board>;
	getAllMainBoards(): Promise<Board[]>;
	deleteManySubBoards(
		dividedBoards: Board[] | ObjectId[] | string[],
		withSession: boolean
	): Promise<number>;
	deleteBoard(boardId: string, withSession: boolean): Promise<Board>;
	updateBoard(boardId: string, board: Board, isNew: boolean): Promise<Board>;
	updateMergedSubBoard(subBoardId: string, userId: string): Promise<Board>;
	updateMergedBoard(boardId: string, newColumns: Column[]): Promise<Board>;
	updatedChannelId(boardId: string, channelId: string): Promise<Board>;
	updatePhase(boardId: string, phase: BoardPhases): Promise<Board>;
}
