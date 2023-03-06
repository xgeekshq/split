import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import BoardType, {
  PhaseChangeEventType,
  CreateBoardDto,
  GetBoardResponse,
  UpdateBoardType,
} from '@/types/board/board';
import { BoardUser } from './board.user';

import UpdateBoardPhaseDto from './updateBoardPhase.dto';

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
  fetchBoard: UseQueryResult<GetBoardResponse | null, unknown>;

  setQueryDataAddBoardUser: (data: BoardUser) => void;

  updateBoardPhase: (data: PhaseChangeEventType) => void;

  updateBoardPhaseMutation: UseMutationResult<void, unknown, UpdateBoardPhaseDto, unknown>;
}
