import { UseMutationResult } from "react-query";
import ColumnType from "./column";
import { HeaderBoardType, Nullable } from "./common";
import { User } from "./user";

export interface BoardType extends HeaderBoardType {
  creationDate?: string;
  columns: Array<ColumnType>;
  createdBy: User;
  locked: boolean;
  password?: string;
}

export interface Boards {
  boards: BoardType[];
}

export interface BoardTypeWithToken {
  newBoard: BoardType;
  token: Nullable<string>;
}

export interface UseBoardType {
  [key: string]: UseMutationResult<BoardType, unknown, BoardTypeWithToken, unknown>;
}
