import fetchData from "../utils/fetchData";
import { BoardType, BoardTypeWithToken } from "../types/board";
import { Nullable } from "../types/common";

export const postBoard = ({ newBoard, token }: BoardTypeWithToken): Promise<BoardType> => {
  return fetchData(`/boards`, "POST", JSON.stringify(newBoard), token);
};

export const putBoard = ({ newBoard, token }: BoardTypeWithToken): Promise<BoardType> => {
  return fetchData(`/boards/${newBoard.id}`, "PUT", JSON.stringify(newBoard), token);
};

export const getBoard = (id: Nullable<string>, token: Nullable<string>): Promise<BoardType> => {
  return fetchData(`/boards/${id}`, "GET", undefined, token);
};

export const getBoards = (token: Nullable<string>): Promise<BoardType[]> => {
  return fetchData(`/boards`, "GET", undefined, token);
};
