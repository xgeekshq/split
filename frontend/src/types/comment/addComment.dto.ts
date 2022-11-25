export default interface AddCommentDto {
  boardId: string;
  cardId: string;
  cardItemId: string | undefined;
  isCardGroup: boolean;
  socketId?: string;
  text: string;
  anonymous: boolean;
}
