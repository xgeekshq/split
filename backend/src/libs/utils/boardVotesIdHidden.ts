import Board from 'src/modules/boards/entities/board.schema';
import { hideText } from './hideText';

export const boardVotesIdHidden = (input: Board, userId: string): Board => {
	const columns = input.columns.map((column) => {
		const cards = column.cards.map((card) => {
			const items = card.items.map((item) => {
				const votes = item.votes.map((vote) => {
					if (String(userId) !== String(vote)) {
						return hideText(String(vote));
					}

					return vote;
				});

				return { ...item, votes };
			});
			const votes = card.votes.map((vote) => {
				if (String(userId) !== String(vote)) {
					return hideText(String(vote));
				}

				return vote;
			});

			return { ...card, items, votes };
		});

		return { ...column, cards };
	});

	return { ...input, columns };
};
