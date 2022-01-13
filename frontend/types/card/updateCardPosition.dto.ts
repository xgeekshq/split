export default interface UpdateCardPositionDto {
  oldColumnId: string;
  targetColumnId: string;
  newPosition: number;
  oldPosition: number;
  boardId: string;
  cardId: string;
  socketId: string;
}
