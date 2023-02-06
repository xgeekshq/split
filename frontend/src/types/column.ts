import { BoardUser } from './board/board.user';
import CardType from './card/card';

interface ColumnType {
  _id: string;
  title: string;
  color: string;
  cards: CardType[];
  cardText?: string;
  isDefaultText?: boolean;
}

export interface CreateColumn extends Omit<ColumnType, '_id' | 'cards' | 'color'> {
  cards: never[];
}

export interface ColumnBoardType {
  columnId: string;
  index: number;
  userId: string;
  cards: CardType[];
  boardId: string;
  title: string;
  color: string;
  socketId: string;
  isMainboard: boolean;
  boardUser?: BoardUser;
  maxVotes?: number;
  countAllCards: number;
  isSubmited: boolean;
  hideCards: boolean;
  cardText?: string;
  isDefaultText?: boolean;
}

export interface ColumnInnerList {
  cards: CardType[];
  colId: string;
  userId: string;
  boardId: string;
  color: string;
  socketId: string;
  isMainboard: boolean;
  boardUser?: BoardUser;
  maxVotes?: number;
  isSubmited: boolean;
  hideCards: boolean;
  cardText?: string;
  isDefaultText?: boolean;
  hasAdminRole: boolean;
}

export type ColumnDragItem = {
  index: number;
  id: string;
  column: ColumnType;
  type: 'COLUMN';
};

export type ColumnDeleteCards = {
  id: string;
  socketId: string;
};

export default ColumnType;
