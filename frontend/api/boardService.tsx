import fetchData from "../utils/fetchData";
import { BoardType, BoardContentType } from "../types/boardTypes";
import { Nullable } from "../types/commonTypes";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const postBoard = async (newBoard: BoardContentType): Promise<BoardType> => {
  return fetchData(`${API_URL}/boards.json`, "POST", JSON.stringify(newBoard));
};

export const getBoard = async (id: Nullable<string>): Promise<BoardContentType> => {
  return fetchData(`${API_URL}/boards/${id}.json`, "GET", null);
};

export const getBoards = async (): Promise<BoardType> => {
  return fetchData<BoardType>(`${API_URL}/boards.json`, "GET", null);
};
