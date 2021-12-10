import BoardChanges from './boardChanges.interface';

export default interface UpdateBoardPayload {
  id: string;
  changes: BoardChanges;
}
