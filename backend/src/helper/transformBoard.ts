import { removeElementAtIndex, addElementAtIndex } from '../utils/array';
import BoardEntity from '../boards/entity/board.entity';
import BoardChanges, {
  CardChanges,
  ColumnChanges,
} from '../interfaces/boardChanges.interface';

const handleCard = <
  BoardT extends BoardEntity,
  CardChangesT extends CardChanges,
>(
  board: BoardT,
  changes: CardChangesT,
) => {
  const { colIdToAdd, colIdToRemove, cardIdxToAdd, cardIdxToRemove } = changes;
  const colToRemove = board.columns.find((col) => col._id === colIdToRemove);
  const colToAdd = board.columns.find((col) => col._id === colIdToAdd);
  const cardToAdd = colToRemove?.cardsOrder[cardIdxToRemove];
  if (cardToAdd && colToAdd) {
    colToRemove.cardsOrder = removeElementAtIndex<string>(
      colToRemove?.cardsOrder,
      cardIdxToRemove,
    );
    colToAdd.cardsOrder = addElementAtIndex<string>(
      colToAdd.cardsOrder,
      cardIdxToAdd,
      cardToAdd,
    );
  }
  return board;
};

const handleCol = <
  BoardT extends BoardEntity,
  ColumnChangesT extends ColumnChanges,
>(
  board: BoardT,
  changes: ColumnChangesT,
) => {
  const { colIdxToAdd, colIdxToRemove } = changes;
  const newCol = board.columnsOrder[colIdxToRemove];
  board.columnsOrder = removeElementAtIndex<string>(
    board.columnsOrder,
    colIdxToRemove,
  );
  board.columnsOrder = addElementAtIndex<string>(
    board.columnsOrder,
    colIdxToAdd,
    newCol,
  );
  return board;
};

const transformBoard = <BoardT, BoardChangesT extends BoardChanges>(
  board: BoardT,
  changes: BoardChangesT,
): BoardEntity => {
  const newBoard: BoardEntity = JSON.parse(JSON.stringify(board));

  switch (changes.type) {
    case 'CARD':
      return handleCard(newBoard, changes as unknown as CardChanges);
    case 'COLUMN':
      return handleCol(newBoard, changes as unknown as ColumnChanges);
    default:
      return newBoard;
  }
};

export default transformBoard;
