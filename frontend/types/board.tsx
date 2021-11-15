import { UseMutationResult } from "react-query";
import { Nullable } from "./common";

export interface BoardType {
  id?: string;
  creationDate: string;
  title: string;
  columns: Array<ColumnType>;
  columnOrder?: Array<string>;
}

export interface ColumnType {
  id?: string;
  title: string;
  color: string;
  cards: Array<CardType>;
  order?: Array<string>;
}

export interface CardType {
  id?: string;
  text: string;
}

export interface BoardTypeWithToken {
  newBoard: BoardType;
  token: Nullable<string>;
}

export interface UseBoardType {
  [key: string]: UseMutationResult<BoardType, unknown, BoardTypeWithToken, unknown>;
}
