import { UseMutationResult, UseQueryResult } from "react-query";
import { BoardType, UpdateTitleWithToken } from "./board";

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, BoardType, unknown>;
  patchBoardTitle: UseMutationResult<BoardType, unknown, UpdateTitleWithToken, unknown>;
  removeBoard: UseMutationResult<BoardType, unknown, string, unknown>;
  fetchBoards: UseQueryResult<BoardType[], unknown>;
  fetchBoard: UseQueryResult<BoardType | null, unknown>;
}
