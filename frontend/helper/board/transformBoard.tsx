import BoardType from "../../types/board/board";
import UpdateCardPositionDto from "../../types/card/updateCardPosition.dto";
import { addElementAtIndex, removeElementAtIndex } from "../../utils/array";

export const handleUpdateCardPosition = (board: BoardType, changes: UpdateCardPositionDto) => {
  const { targetColumnId, colIdOfCard, newPosition, cardId } = changes;
  const colToRemove = board.columns.find((col) => col._id === colIdOfCard);
  const colToAdd = board.columns.find((col) => col._id === targetColumnId);
  const cardToAdd = colToRemove?.cards.find((card) => card._id === cardId);
  const cardPosition = colToRemove?.cards.findIndex((card) => card._id === cardId);
  if (!!cardToAdd && !!colToAdd && !!colToRemove && cardPosition !== undefined) {
    colToRemove.cards = removeElementAtIndex(colToRemove.cards, cardPosition);
    colToAdd.cards = addElementAtIndex(colToAdd.cards, newPosition, cardToAdd);
  }
  return board;
};
