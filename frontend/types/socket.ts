import BoardChanges from "./boardChanges";

export interface UpdatePayload {
  id: string | undefined;
  changes: BoardChanges;
}
