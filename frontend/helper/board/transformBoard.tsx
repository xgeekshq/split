import BoardType from '../../types/board/board';
import UpdateCardPositionDto from '../../types/card/updateCardPosition.dto';
import { addElementAtIndex, removeElementAtIndex } from '../../utils/array';

export const handleUpdateCardPosition = (board: BoardType, changes: UpdateCardPositionDto) => {
	const { targetColumnId, colIdOfCard, newPosition, cardPosition } = changes;
	const colToRemove = board.columns.find((col) => col._id === colIdOfCard);
	const colToAdd = board.columns.find((col) => col._id === targetColumnId);
	const cardToAdd = colToRemove?.cards[cardPosition];
	if (cardToAdd && colToAdd && colToRemove) {
		colToRemove.cards = removeElementAtIndex(colToRemove.cards, cardPosition);
		colToAdd.cards = addElementAtIndex(colToAdd.cards, newPosition, cardToAdd);
	}
	return board;
};
