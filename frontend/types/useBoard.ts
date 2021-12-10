import { UseMutationResult, UseQueryResult } from "react-query";
import { BoardType, BoardTypeWithToken } from "./board";

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, BoardTypeWithToken, unknown>;
  fetchBoards: UseQueryResult<BoardType[], unknown>;
  fetchBoard: UseQueryResult<BoardType | null, unknown>;
}
