import fetchData from "../utils/fetchData";
import { BoardType, UpdateTitleWithToken } from "../types/board";
import { Nullable } from "../types/common";

export const postBoard = (newBoard: BoardType): Promise<BoardType> => {
  return fetchData(`/boards`, { method: "POST", data: newBoard });
};

export const updateBoardTitle = ({ id, title }: UpdateTitleWithToken): Promise<BoardType> => {
  return fetchData(`/boards/${id}/updateTitle`, { method: "PATCH", data: { title } });
};

export const getBoard = (id: Nullable<string>): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${id}`, { method: "POST" });
};

export const getBoardWithAuth = (id: string): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${id}`);
};

export const getBoards = (): Promise<BoardType[]> => {
  return fetchData<BoardType[]>(`/boards`);
};

export const deleteBoard = async (id: string): Promise<BoardType> => {
  return fetchData(`/boards/${id}`, { method: "DELETE" });
};
