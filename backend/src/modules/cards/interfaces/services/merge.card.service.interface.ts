import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface MergeCardService {
  mergeCards(
    boardId: string,
    draggedCardId: string,
    cardId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}
