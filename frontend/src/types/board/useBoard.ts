import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import BoardType, { CreateBoardDto, GetBoardResponse, UpdateBoardType } from './board';

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, CreateBoardDto, unknown>;
  updateBoard: UseMutationResult<
    BoardType,
    unknown,
    UpdateBoardType & { socketId: string; deletedColumns?: string[] },
    unknown
  >;
  deleteBoard: UseMutationResult<
    BoardType,
    unknown,
    { id: string; socketId?: string; teamId?: string },
    unknown
  >;
  fetchBasedBoard: UseQueryResult<GetBoardResponse | null, unknown>;
}
