export default interface DeleteCardDto {
  cardId: string;

  boardId: string;

  socketId?: string;

  isCardGroup: boolean;

  cardItemId?: string;
}
