import { BoardType } from "../types/board";
import BoardChanges, { CardChanges, ColumnChanges } from "../types/boardChanges";
import { addElementAtIndex, removeElementAtIndex } from "../utils/array";

const handleCard = <BoardT extends BoardType, CardChangesT extends CardChanges>(
  board: BoardT,
  changes: CardChangesT
) => {
  const { colIdToAdd, colIdToRemove, cardIdxToAdd, cardIdxToRemove } = changes;
  const colToRemove = board.columns.find((col) => col._id === colIdToRemove);
  const colToAdd = board.columns.find((col) => col._id === colIdToAdd);
  const cardToAdd = colToRemove?.cardsOrder[cardIdxToRemove];
  if (cardToAdd && colToAdd && colToRemove) {
    colToRemove.cardsOrder = removeElementAtIndex<string>(colToRemove?.cardsOrder, cardIdxToRemove);
    colToAdd.cardsOrder = addElementAtIndex<string>(colToAdd.cardsOrder, cardIdxToAdd, cardToAdd);
  }

  return board;
};

const handleCol = <BoardT extends BoardType, ColumnChangesT extends ColumnChanges>(
  board: BoardT,
  changes: ColumnChangesT
) => {
  const { colIdxToAdd, colIdxToRemove } = changes;
  const newCol = board.columnsOrder[colIdxToRemove];
  board.columnsOrder = removeElementAtIndex<string>(board.columnsOrder, colIdxToRemove);
  board.columnsOrder = addElementAtIndex<string>(board.columnsOrder, colIdxToAdd, newCol);
  return board;
};

const transformBoard = <BoardT, BoardChangesT>(
  board: BoardT,
  changes: BoardChangesT
): BoardType => {
  const newBoard: BoardType = JSON.parse(JSON.stringify(board));

  switch ((changes as unknown as BoardChanges).type) {
    case "CARD":
      return handleCard(newBoard, changes as unknown as CardChanges);
    case "COLUMN":
      return handleCol(newBoard, changes as unknown as ColumnChanges);
    default:
      return newBoard;
  }
};

export default transformBoard;
