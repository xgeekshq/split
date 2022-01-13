import CardType from "../card/card";

export interface ColumnType {
  _id: string;
  title: string;
  color: string;
  cards: CardType[];
}

export interface ColumnBoardType {
  column: ColumnType;
  index: number;
  userId: string;
}

export interface ColumnInnerList {
  cards: CardType[];
  color: string;
  userId: string;
  colId: string;
}

export type ColumnDragItem = {
  index: number;
  id: string;
  column: ColumnType;
  type: "COLUMN";
};

export type ColumnToAdd = Omit<ColumnType, "_id">;

export default ColumnType;
