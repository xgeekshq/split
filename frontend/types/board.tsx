import { UseMutationResult } from "react-query";

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

export interface UseBoardType {
  [key: string]: UseMutationResult<BoardType, unknown, BoardType, unknown>;
}
