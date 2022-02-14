import { BoardDocument } from '../../../boards/schemas/board.schema';

export interface DeleteCardApplication {
  delete(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<BoardDocument>;
}
