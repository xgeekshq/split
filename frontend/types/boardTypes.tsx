import { UseMutationResult } from "react-query";
import { Nullable } from "./commonTypes";

export interface BoardType {
  name?: Nullable<string>;
  title: string;
}

export interface UseBoardType {
  [key: string]: UseMutationResult<BoardType, unknown, BoardType, unknown>;
}
