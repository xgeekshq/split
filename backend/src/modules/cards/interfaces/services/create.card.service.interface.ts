import { LeanDocument } from 'mongoose';

import { BoardDocument } from 'modules/boards/schemas/board.schema';

import CardDto from '../../dto/card.dto';

export interface CreateCardService {
	create(
		boardId: string,
		userId: string,
		card: CardDto,
		colIdToAdd: string
	): Promise<LeanDocument<BoardDocument> | null>;
}
