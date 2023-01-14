export default interface DeleteCardDto {
  columnId: string;

  cardId: string;

  boardId: string;

  socketId?: string;

  isCardGroup: boolean;

  cardItemId?: string;

  userId: string;
}
