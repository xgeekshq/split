import { CardItemToAdd, CardItemType } from '@/types/card/cardItem';
import CommentType from '@/types/comment/comment';
import { User } from '@/types/user/user';

export default interface CardType {
  _id: string;
  text: string;
  votes: string[];
  comments: CommentType[];
  items: CardItemType[];
  createdBy?: User;
  createdByTeam?: string;
  anonymous: boolean;
}

export interface CardToAdd extends Omit<CardType, '_id' | 'items'> {
  items: CardItemToAdd[];
}

export interface CardDragItem {
  index: number;
  columnId: string;
  color: string;
  card: CardType;
  cardGroupId?: string;
  userId: string;
  type: 'CARD' | 'CARD_GROUP';
}
