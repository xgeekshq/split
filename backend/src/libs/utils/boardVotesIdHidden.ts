import { ObjectId } from 'mongodb';
import { LeanDocument } from 'mongoose';

import Board, { BoardDocument } from 'modules/boards/schemas/board.schema';

import { hideText } from './hideText';

export const boardVotesIdHidden = (
	input:
		| LeanDocument<BoardDocument>
		| LeanDocument<
				Board & {
					_id: ObjectId;
				}
		  >,
	userId: string
):
	| LeanDocument<BoardDocument>
	| LeanDocument<
			Board & {
				_id: ObjectId;
			}
	  > => {
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
