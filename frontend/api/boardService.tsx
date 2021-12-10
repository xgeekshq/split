import fetchData from "../utils/fetchData";
import { BoardIdTypeWithToken, BoardType, BoardTypeWithToken } from "../types/board";
import { Nullable } from "../types/common";

export const postBoard = ({ newBoard, token }: BoardTypeWithToken): Promise<BoardType> => {
  return fetchData(`/boards`, "POST", JSON.stringify(newBoard), token);
};

export const putBoard = ({ newBoard, token }: BoardTypeWithToken): Promise<BoardType> => {
  return fetchData(`/boards/${newBoard._id}`, "PUT", JSON.stringify(newBoard), token);
};

export const getBoard = (id: Nullable<string>): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${id}`, "POST", undefined, undefined);
};
export const getBoardWithAuth = ({ id, token }: BoardIdTypeWithToken): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${id}`, "GET", undefined, token);
};

export const getBoards = (token: Nullable<string>): Promise<BoardType[]> => {
  return fetchData<BoardType[]>(`/boards`, "GET", undefined, token);
};
