import CommentType from '../comment/comment';
import { User } from '../user/user';

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
}

export interface CardItemToAdd extends Omit<CardItemType, '_id'> {
	_id?: string;
}
