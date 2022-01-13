import { UseMutationResult, UseQueryResult } from "react-query";
import BoardType, { BoardToAdd } from "./board";
import UpdateCardPositionDto from "../card/updateCardPosition.dto";
import UpdateBoardDto from "./updateBoard";

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, BoardToAdd, unknown>;
  updateBoard: UseMutationResult<BoardType, unknown, UpdateBoardDto, unknown>;
  deleteBoard: UseMutationResult<BoardType, unknown, string, unknown>;
  fetchBoards: UseQueryResult<BoardType[], unknown>;
  fetchBoard: UseQueryResult<BoardType | null, unknown>;
  updateCardPosition: UseMutationResult<BoardType, unknown, UpdateCardPositionDto, unknown>;
}
