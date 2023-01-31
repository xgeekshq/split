import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import Card from '../../schemas/card.schema';

export interface DeleteCardApplication {
	delete(
		boardId: string,
		cardId: string,
		userId: string,
		card?: Card
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteFromCardGroup(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}
