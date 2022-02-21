import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../../boards/schemas/board.schema';
import CardDto from '../../dto/card.dto';

export interface CreateCardService {
  create(
    cardId: string,
    userId: string,
    card: CardDto,
    colIdToAdd: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}
