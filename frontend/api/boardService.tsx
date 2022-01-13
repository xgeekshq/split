import fetchData from "../utils/fetchData";
import BoardType, { BoardToAdd } from "../types/board/board";
import UpdateCardPositionDto from "../types/card/updateCardPosition.dto";
import UpdateBoardDto from "../types/board/updateBoard";

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

export const updateCardPositionRequest = (
  updateCardPosition: UpdateCardPositionDto
): Promise<BoardType> => {
  return fetchData<BoardType>(
    `/boards/${updateCardPosition.boardId}/card/${updateCardPosition.cardId}/updateCardPosition`,
    { method: "PUT", data: updateCardPosition }
  );
};

// #endregion
