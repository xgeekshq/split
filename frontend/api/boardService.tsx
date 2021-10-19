import fetchData from "../utils/fetchData";
import { BoardType } from "../types/boardTypes";
import { Nullable } from "../types/commonTypes";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const postBoard = async (newBoard: BoardType): Promise<BoardType> => {
  return fetchData(`${API_URL}/boards`, "POST", JSON.stringify(newBoard));
};

export const getBoard = async (id: Nullable<string>): Promise<BoardType> => {
  return fetchData(`${API_URL}/boards/${id}`, "GET", null);
};

export const getBoards = async (): Promise<BoardType[]> => {
  return fetchData(`${API_URL}/boards`, "GET", null);
};
