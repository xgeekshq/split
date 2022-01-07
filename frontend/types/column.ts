import CardType from "./card";

export interface ColumnType {
  _id?: string;
  title: string;
  color: string;
  cardsOrder: string[];
}

interface Columns {
  columns: ColumnType[];
}

export interface ColumnBoardType {
  column: ColumnType;
  index: number;
}

export interface ColumnCardType extends Columns {
  color: string;
  card: CardType;
  index: number;
}

export interface ColumnInnerList {
  cards: CardType[];
  cardsOrder: string[];
  color: string;
  columns: ColumnType[];
}

export default ColumnType;
