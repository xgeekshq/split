import BoardType from 'types/board/board';
import MergeCardsDto from 'types/board/mergeCard.dto';
import RemoveFromCardGroupDto from 'types/card/removeFromCardGroup.dto';
import UpdateCardPositionDto from 'types/card/updateCardPosition.dto';
import { addElementAtIndex, removeElementAtIndex } from 'utils/array';

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

export const handleMergeCard = (board: BoardType, changes: MergeCardsDto) => {
	const boardData: BoardType = JSON.parse(JSON.stringify(board));

	const { cardGroupId, cardId, cardPosition, colIdOfCardGroup } = changes;

	boardData.columns.forEach((column) => {
		if (column._id === colIdOfCardGroup) {
			column.cards.forEach((card) => {
				if (card._id === cardGroupId) {
					const selectedCard = column.cards.find((findCard) => findCard._id === cardId);
					if (selectedCard) {
						card.items = addElementAtIndex(card.items, cardPosition, {
							_id: selectedCard._id,
							text: selectedCard.text,
							comments: selectedCard.comments,
							votes: selectedCard.votes,
							createdBy: selectedCard.createdBy,
							createdByTeam: selectedCard.createdByTeam
						});

						const index = column.cards.findIndex((idxCard) => idxCard === selectedCard);
						column.cards = removeElementAtIndex(column.cards, index);
					}
				}
			});
		}
	});

	return boardData;
};

export const handleUnMergeCard = (board: BoardType, changes: RemoveFromCardGroupDto) => {
	const boardData: BoardType = JSON.parse(JSON.stringify(board));

	const { columnId, cardGroupId, cardId } = changes;
	boardData.columns.forEach((column) => {
		if (column._id === columnId) {
			column.cards.forEach((card, idxCard) => {
				if (card._id === cardGroupId) {
					card.items.forEach((cardItem) => {
						if (cardItem._id === cardId) {
							column.cards = addElementAtIndex(
								column.cards,
								column.cards.length - 1,
								{
									...cardItem,
									items: [cardItem]
								}
							);
							card.items = removeElementAtIndex(card.items, idxCard);
						}
					});
				}
			});
		}
	});

	return boardData;
};
