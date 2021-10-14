import { useQuery, UseQueryResult } from "react-query";
import { BoardType } from "../types/boardTypes";
import fetchData from "../utils/fetchData";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getBoards = async (): Promise<BoardType[]> => {
  return fetchData<BoardType[]>(`${API_URL}/boards.json`, "GET", null);
};

export default function useBoards(): UseQueryResult<BoardType[], string> {
  return useQuery<BoardType[], string>("boards", getBoards);
}
