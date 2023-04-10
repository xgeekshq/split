import BoardType, {
  CreateBoardDto,
  DuplicateBoardType,
  GetBoardResponse,
  InfiniteBoards,
  PhaseChangeEventType,
  UpdateBoardType,
} from '@/types/board/board';
import { UseInfiniteQueryResult, UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import UpdateBoardPhaseDto from '@/types/board/updateBoardPhase.dto';
import { BoardUser } from '@/types/board/board.user';

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, CreateBoardDto, unknown>;
  duplicateBoard: UseMutationResult<BoardType, unknown, DuplicateBoardType, unknown>;
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
  fetchBoard: UseQueryResult<GetBoardResponse | null, unknown>;

  fetchBoards: UseInfiniteQueryResult<InfiniteBoards, unknown>;

  setQueryDataAddBoardUser: (data: BoardUser) => void;

  updateBoardPhase: (data: PhaseChangeEventType) => void;

  updateBoardPhaseMutation: UseMutationResult<void, unknown, UpdateBoardPhaseDto, unknown>;
}
