import { UseMutationResult } from "react-query";

export interface BoardType {
  [name: string]: BoardContentType;
}

export interface BoardContentType {
  title: string;
  creationDate: string;
  columns: ColumnType;
}

export interface ColumnType {
  [columnName: string]: {
    color: string;
    cards: Array<CardType>;
  };
}

export interface CardType {
  [cardName: string]: string;
  text: string;
}

export interface UseBoardType {
  [key: string]: UseMutationResult<BoardType, unknown, BoardContentType, unknown>;
}
