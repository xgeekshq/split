export default interface UpdateBoardPayload {
  id: string;
  changes: ChangesBoard;
}

export interface ChangesBoard {
  type: string;
  colToRemove: string;
  colToAdd: string;
  cardToRemove: number;
  cardToAdd: number;
}
