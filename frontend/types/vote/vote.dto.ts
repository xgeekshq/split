export default interface VoteDto {
  cardId: string;

  cardItemId?: string;

  boardId: string;

  socketId?: string;

  isCardGroup: boolean;
}
