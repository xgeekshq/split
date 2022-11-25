import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface CreateVoteService {
	addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string
	): Promise<LeanDocument<BoardDocument> | null>;

	addVoteToCardGroup(
		boardId: string,
		cardId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}
