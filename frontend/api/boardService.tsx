import fetchData from "../utils/fetchData";
import { BoardType } from "../types/board";
import { Nullable } from "../types/common";

export const postBoard = (newBoard: BoardType): Promise<BoardType> => {
  return fetchData(`/boards`, "POST", JSON.stringify(newBoard));
};

export const putBoard = (newBoard: BoardType): Promise<BoardType> => {
  return fetchData(`/boards/${newBoard.id}`, "PUT", JSON.stringify(newBoard));
};

export const getBoard = (id: Nullable<string>): Promise<BoardType> => {
  return fetchData(`/boards/${id}`, "GET", undefined);
};

export const getBoards = (): Promise<BoardType[]> => {
  return fetchData(`/boards`, "GET", undefined);
};
