import fetchData from "../utils/fetchData";
import BoardType, { BoardToAdd } from "../types/board/board";
import UpdateCardPositionDto from "../types/card/updateCardPosition.dto";
import UpdateBoardDto from "../types/board/updateBoard";
import AddCardDto from "../types/card/addCard.dto";
import DeleteCardDto from "../types/card/deleteCard.dto";
import UpdateCardDto from "../types/card/updateCard.dto";
// #region BOARD

export const createBoardRequest = (newBoard: BoardToAdd): Promise<BoardType> => {
  return fetchData(`/boards`, { method: "POST", data: newBoard });
};

export const updateBoardRequest = ({ board }: UpdateBoardDto): Promise<BoardType> => {
  return fetchData(`/boards/${board._id}`, { method: "PUT", data: board });
};

export const getBoardRequest = (id: string): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${id}`);
};

export const getBoardsRequest = (): Promise<BoardType[]> => {
  return fetchData<BoardType[]>(`/boards`);
};

export const deleteBoardRequest = async (id: string): Promise<BoardType> => {
  return fetchData(`/boards/${id}`, { method: "DELETE" });
};

// #endregion

// #region CARD

export const addCardRequest = (addCardDto: AddCardDto): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${addCardDto.boardId}/card`, {
    method: "POST",
    data: addCardDto,
  });
};

export const updateCardRequest = (updateCard: UpdateCardDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    updateCard.isCardGroup
      ? `/boards/${updateCard.boardId}/card/${updateCard.cardId}`
      : `/boards/${updateCard.boardId}/card/${updateCard.cardId}/items/${updateCard.cardItemId}`,
    { method: "PUT", data: updateCard }
  );
};

export const updateCardPositionRequest = (
  updateCardPosition: UpdateCardPositionDto
): Promise<BoardType> => {
  return fetchData<BoardType>(
    `/boards/${updateCardPosition.boardId}/card/${updateCardPosition.cardId}/updateCardPosition`,
    { method: "PUT", data: updateCardPosition }
  );
};

export const deleteCardRequest = (deleteCardDto: DeleteCardDto): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${deleteCardDto.boardId}/card/${deleteCardDto.cardId}`, {
    method: "DELETE",
    data: deleteCardDto,
  });
};

// #endregion
