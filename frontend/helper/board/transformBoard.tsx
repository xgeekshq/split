import BoardType from '../../types/board/board';
import UpdateCardPositionDto from '../../types/card/updateCardPosition.dto';
import { addElementAtIndex, removeElementAtIndex } from '../../utils/array';

export const handleUpdateCardPosition = (board: BoardType, changes: UpdateCardPositionDto) => {
	// avoid read only error
	const boardData: BoardType = JSON.parse(JSON.stringify(board));

	const { targetColumnId, colIdOfCard, newPosition, cardPosition } = changes;
	const colToRemove = boardData.columns.find((col) => col._id === colIdOfCard);
	const colToAdd = boardData.columns.find((col) => col._id === targetColumnId);
	const cardToAdd = colToRemove?.cards[cardPosition];

	if (cardToAdd && colToAdd && colToRemove) {
		colToRemove.cards = removeElementAtIndex(colToRemove.cards, cardPosition);
		colToAdd.cards = addElementAtIndex(colToAdd.cards, newPosition, cardToAdd);
	}
	return boardData;
};
