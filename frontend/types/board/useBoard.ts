import { UseMutationResult, UseQueryResult } from "react-query";
import BoardType, { CreateBoardDto } from "./board";
import UpdateBoardDto from "./updateBoard";

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, CreateBoardDto, unknown>;
  updateBoard: UseMutationResult<BoardType, unknown, UpdateBoardDto, unknown>;
  deleteBoard: UseMutationResult<BoardType, unknown, string, unknown>;
  fetchBoard: UseQueryResult<BoardType | null, unknown>;
}
