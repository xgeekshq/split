import CommentType from '@/types/comment/comment';
import { User } from '@/types/user/user';

export type CardGroupDragItem = {
  index: number;
  id: string;
  columnId: string;
  color: string;
  type: 'CARD_GROUP';
};

export interface CardItemType {
  _id: string;
  text: string;
  comments: CommentType[];
  votes: string[];
  createdBy?: User;
  createdByTeam?: string;
  anonymous: boolean;
}

export interface CardItemToAdd extends Omit<CardItemType, '_id'> {
  _id?: string;
}
