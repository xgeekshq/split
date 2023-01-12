import { LeanDocument } from 'mongoose';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface MergeCardApplication {
	mergeCards(
		boardId: string,
		draggedCardId: string,
		cardId: string,
		userId: string
	): Promise<LeanDocument<BoardDocument> | null>;
}
