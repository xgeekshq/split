import { CardDocument } from '../../schemas/card.schema';

export interface GetCardService {
  getCardFromBoard(
    boardId: string,
    cardId: string,
  ): Promise<CardDocument | null>;
}
