import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';
import Card from '../../entities/card.schema';

export interface DeleteCardServiceInterface {
	delete(boardId: string, cardId: string): Promise<LeanDocument<BoardDocument> | null>;

	deleteFromCardGroup(
		boardId: string,
		cardId: string,
		cardItemId: string
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteCardVotesFromColumn(boardId: string, cards: Card[]): Promise<void>;
}
