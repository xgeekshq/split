import CardType from "./card";
import { HeaderBoardType } from "./common";

interface ColumnType extends HeaderBoardType {
  color: string;
  cards: CardType[];
}

interface Columns {
  columns: ColumnType[];
}

export interface ColumnBoardType extends HeaderBoardType, CardsColumnsType {
  column: ColumnType;
  index: number;
}

export interface ColumnCardType extends Columns {
  color: string;
  card: CardType;
  cardId: string;
  index: number;
}

export interface ColumnInnerList extends CardsColumnsType {
  color: string;
}

export interface CardsColumnsType extends Columns {
  cards: CardType[];
}

export default ColumnType;
