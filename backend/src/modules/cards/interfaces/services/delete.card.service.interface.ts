import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';
import Card from '../../schemas/card.schema';

export interface DeleteCardService {
	delete(
		boardId: string,
		cardId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteFromCardGroup(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteCardVotesFromColumn(boardId: string, cards: Card[]): Promise<void>;
}
