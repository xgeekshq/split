export interface CardChanges {
  colIdToRemove: string;
  colIdToAdd: string;
  cardIdxToRemove: number;
  cardIdxToAdd: number;
  type: "CARD";
}
export interface ColumnChanges {
  colIdxToRemove: number;
  colIdxToAdd: number;
  type: "COLUMN";
}

type BoardChanges = CardChanges | ColumnChanges;
export default BoardChanges;
