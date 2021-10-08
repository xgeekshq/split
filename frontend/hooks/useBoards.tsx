import { useQuery, UseQueryResult } from "react-query";
import { BoardType } from "../types/boardTypes";
import { getBoards } from "../api/boardService";

export default function useBoards(): UseQueryResult<BoardType> {
  return useQuery<BoardType>("boards", getBoards);
}
