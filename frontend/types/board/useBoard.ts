import { UseMutationResult, UseQueryResult } from "react-query";
import BoardType, { BoardToAdd } from "./board";
import UpdateBoardDto from "./updateBoard";
import UpdateCardPositionDto from "../card/updateCardPosition.dto";
import AddCardDto from "../card/addCard.dto";
import UpdateCardDto from "../card/updateCard.dto";
import DeleteCardDto from "../card/deleteCard.dto";

export default interface UseBoardType {
  createBoard: UseMutationResult<BoardType, unknown, BoardToAdd, unknown>;
  updateBoard: UseMutationResult<BoardType, unknown, UpdateBoardDto, unknown>;
  deleteBoard: UseMutationResult<BoardType, unknown, string, unknown>;
  fetchBoards: UseQueryResult<BoardType[], unknown>;
  fetchBoard: UseQueryResult<BoardType | null, unknown>;
  addCardInColumn: UseMutationResult<BoardType, unknown, AddCardDto, unknown>;
  updateCard: UseMutationResult<BoardType, unknown, UpdateCardDto, unknown>;
  deleteCard: UseMutationResult<BoardType, unknown, DeleteCardDto, unknown>;
  updateCardPosition: UseMutationResult<BoardType, unknown, UpdateCardPositionDto, unknown>;
}
