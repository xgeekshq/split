import Column from 'src/modules/columns/entities/column.schema';
import { hideVotes } from './clean-boards.spec';

export const hideVotesFromColumns = (columns: Column[], userId: string) => {
	return columns.map((column) => {
		column.cards.forEach((card) => {
			card.votes = hideVotes(card.votes as string[], userId);
			card.items.forEach(
				(cardItem) => (cardItem.votes = hideVotes(cardItem.votes as string[], userId))
			);
		});

		return column;
	});
};
