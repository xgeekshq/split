import Action from "../types/action";
import BoardType from "../types/board/board";
import CardType from "../types/card/card";
import UpdateCardPositionDto from "../types/card/updateCardPosition.dto";
import { addElementAtIndex, removeElementAtIndex } from "../utils/array";
import { UPDATE_CARD_POSITION } from "../utils/constants";

const handleUpdateCardPosition = <BoardT extends BoardType>(
  board: BoardT,
  changes: UpdateCardPositionDto
) => {
  const { targetColumnId, oldColumnId, newPosition, oldPosition } = changes;
  const colToRemove = board.columns.find((col) => col._id === oldColumnId);
  const colToAdd = board.columns.find((col) => col._id === targetColumnId);
  const cardToAdd = colToRemove?.cards[oldPosition];
  if (cardToAdd && colToAdd && colToRemove) {
    colToRemove.cards = removeElementAtIndex<CardType>(colToRemove.cards, oldPosition);
    colToAdd.cards = addElementAtIndex<CardType>(colToAdd.cards, newPosition, cardToAdd);
  }
  return board;
};

const transformBoard = <BoardT, ActionT>(board: BoardT, action: ActionT): BoardType => {
  const newBoard = { ...board } as unknown as BoardType;
  const { type, changes } = action as unknown as Action;
  switch (type) {
    case UPDATE_CARD_POSITION:
      return handleUpdateCardPosition(newBoard, changes);
    default:
      return newBoard;
  }
};

export default transformBoard;
