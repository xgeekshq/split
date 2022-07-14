import CardType from 'types/card/card';
import { CardItemType } from 'types/card/cardItem';
import CommentType from 'types/comment/comment';

export function cardBlur(hideCards: boolean, card: CardType, userId: string) {
	return hideCards && card.createdBy?._id !== userId ? 'blur($sizes$6)' : 'none';
}

export function cardItemBlur(hideCards: boolean, item: CardItemType, userId: string) {
	return hideCards && item.createdBy?._id !== userId ? 'blur($sizes$6)' : 'none';
}

export function commentBlur(hideCards: boolean, comment: CommentType, userId: string) {
	return hideCards && comment.createdBy?._id !== userId ? 'blur($sizes$6)' : 'none';
}
