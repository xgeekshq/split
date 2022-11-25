export default interface RemoveFromCardGroupDto {
  columnId: string;

  cardId: string;

  boardId: string;

  cardGroupId: string;

  socketId: string;

  newPosition: number;
}
