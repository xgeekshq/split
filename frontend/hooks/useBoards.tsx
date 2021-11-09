import { useQuery, UseQueryResult } from "react-query";
import { BoardType } from "../types/board";
import { getBoards } from "../api/boardService";

export default function useBoards(): UseQueryResult<BoardType[]> {
  return useQuery("boards", getBoards);
}
