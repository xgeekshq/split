import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface DeleteCardService {
  delete(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<BoardDocument>;
}
