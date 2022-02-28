import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface UnmergeCardService {
  unmergeAndUpdatePosition(
    boardId: string,
    cardGroupId: string,
    draggedCardId: string,
    columnId: string,
    position: number,
  ): Promise<LeanDocument<BoardDocument> | null>;
}
