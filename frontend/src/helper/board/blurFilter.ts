import CardType from '@/types/card/card';
import { CardItemType } from '@/types/card/cardItem';
import CommentType from '@/types/comment/comment';
import { User } from '@/types/user/user';

export function cardBlur(hideCards: boolean, card: CardType, userId: string) {
  return hideCards && (card.createdBy?._id !== userId || card.createdByTeam)
    ? 'blur($sizes$6)'
    : 'none';
}

export function cardFooterBlur(hideCards: boolean, createdBy?: User, userId?: string) {
  return hideCards && (createdBy?._id !== userId || createdBy?._id === undefined)
    ? 'blur($sizes$6)'
    : 'none';
}

export function cardItemBlur(hideCards: boolean, item: CardItemType, userId: string) {
  return hideCards && item.createdBy?._id !== userId ? 'blur($sizes$6)' : 'none';
}

export function commentBlur(hideCards: boolean, comment: CommentType, userId: string) {
  return hideCards && comment.createdBy?._id !== userId ? 'blur($sizes$6)' : 'none';
}
