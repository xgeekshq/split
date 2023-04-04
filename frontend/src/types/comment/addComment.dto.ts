import CommentType from '@/types/comment/comment';

export default interface AddCommentDto {
  boardId: string;
  cardId: string;
  cardItemId?: string;
  isCardGroup: boolean;
  socketId?: string;
  text: string;
  anonymous: boolean;
  columnId: string;
  newComment?: CommentType;
  fromSocket: boolean;
}
