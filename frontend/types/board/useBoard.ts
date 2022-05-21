import { UseMutationResult, UseQueryResult } from 'react-query';
import BoardType, { CreateBoardDto, GetBoardResponse } from './board';
import UpdateBoardDto from './updateBoard';

export default interface UseBoardType {
	createBoard: UseMutationResult<BoardType, unknown, CreateBoardDto, unknown>;
	updateBoard: UseMutationResult<BoardType, unknown, UpdateBoardDto, unknown>;
	deleteBoard: UseMutationResult<BoardType, unknown, string, unknown>;
	fetchBoard: UseQueryResult<GetBoardResponse | null, unknown>;
}
