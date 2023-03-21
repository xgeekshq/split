import Column from 'src/modules/columns/entities/column.schema';
import Board from '../entities/board.schema';

/**
 * Method to generate columns from sub-board
 * @param subBoard: Board
 * @return Column[]
 */
export const generateNewSubColumns = (subBoard: Board) => {
	return [...subBoard.columns].map((column) => {
		const newColumn = {
			title: column.title,
			color: column.color,
			cardText: column.cardText,
			isDefaultText: column.isDefaultText,
			cards: column.cards.map((card) => {
				const newCard = {
					text: card.text,
					createdBy: card.createdBy,
					votes: card.votes,
					anonymous: card.anonymous,
					createdByTeam: subBoard.title.replace('board', ''),
					comments: card.comments.map((comment) => {
						return {
							text: comment.text,
							createdBy: comment.createdBy,
							anonymous: comment.anonymous
						};
					}),
					items: card.items.map((cardItem) => {
						return {
							text: cardItem.text,
							votes: cardItem.votes,
							createdByTeam: subBoard.title.replace('board ', ''),
							createdBy: cardItem.createdBy,
							anonymous: cardItem.anonymous,
							comments: cardItem.comments.map((comment) => {
								return {
									text: comment.text,
									createdBy: comment.createdBy,
									anonymous: comment.anonymous
								};
							}),
							createdAt: card.createdAt
						};
					}),
					createdAt: card.createdAt
				};

				return newCard;
			})
		};

		return newColumn as Column;
	});
};
