import { BoardDocument } from 'src/modules/boards/schemas/board.schema';

export interface DeleteCardApplication {
  delete(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<BoardDocument>;
}
