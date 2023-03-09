import { UpdateResult } from 'mongodb';
import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/entities/board.schema';

export interface UpdateCardServiceInterface {
	updateCardPosition(
		boardId: string,
		cardId: string,
		targetColumnId: string,
		newPosition: number
	): Promise<void>;

	updateCardText(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string,
		text: string
	): Promise<LeanDocument<BoardDocument>>;

	updateCardGroupText(
		boardId: string,
		cardId: string,
		userId: string,
		text: string
	): Promise<LeanDocument<BoardDocument>>;

	pullCardItem(boardId: string, itemId: string, session?: boolean): Promise<UpdateResult>;
}
