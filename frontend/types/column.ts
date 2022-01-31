import CardType from "./card/card";

interface ColumnType {
  _id: string;
  title: string;
  color: string;
  cards: CardType[];
}

export type CreateColumn = Omit<ColumnType, "_id">;

export interface ColumnBoardType {
  columnId: string;
  userId: string;
  cards: CardType[];
  boardId: string;
  title: string;
  color: string;
  socketId: string;
}

export interface ColumnInnerList {
  cards: CardType[];
  colId: string;
  userId: string;
  boardId: string;
  color: string;
  socketId: string;
}

export type ColumnDragItem = {
  index: number;
  id: string;
  column: ColumnType;
  type: "COLUMN";
};

export default ColumnType;
