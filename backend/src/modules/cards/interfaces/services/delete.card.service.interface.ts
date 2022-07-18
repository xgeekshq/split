import { LeanDocument } from 'mongoose';

import { BoardDocument } from 'modules/boards/schemas/board.schema';

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
}
