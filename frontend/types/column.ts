import CardType from "./card";
import { HeaderBoardType } from "./common";

interface ColumnType extends HeaderBoardType {
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
