import CardType from "./card";
import { ColumnType } from "./column";
import { Nullable } from "./common";
import { User } from "./user";

export interface BoardType {
  _id?: string;
  title: string;
  creationDate?: string;
  columns: ColumnType[];
  createdBy: User;
  locked: boolean;
  password?: string;
  columnsOrder: string[];
  cards: CardType[];
}
export interface BoardTypeWithToken {
  newBoard: BoardType;
  token: Nullable<string>;
}

export interface UpdateTitleWithToken {
  id: string;
  title: string;
  boardPage: boolean;
}

export interface BoardIdTypeWithToken {
  id: string;
  token: Nullable<string>;
}
