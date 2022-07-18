import { LeanDocument } from 'mongoose';

import { CardDocument } from '../../schemas/card.schema';

export interface GetCardService {
	getCardFromBoard(boardId: string, cardId: string): Promise<LeanDocument<CardDocument> | null>;

	getCardItemFromGroup(
		boardId: string,
		cardItemId: string
	): Promise<LeanDocument<CardDocument> | null>;
}
