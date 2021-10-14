import { useQuery, UseQueryResult } from "react-query";
import { BoardType } from "../types/boardTypes";
import fetchData from "../utils/fetchData";

export const getBoards = async (): Promise<BoardType[]> => {
  return fetchData<BoardType[]>(`${process.env.BACKEND_URL}/boards.json`, "GET", null);
};

export default function useBoards(): UseQueryResult<BoardType[], string> {
  return useQuery<BoardType[], string>("boards", getBoards);
}
