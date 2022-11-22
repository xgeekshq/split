import { LeanDocument } from 'mongoose';

import { TeamDto } from 'modules/communication/dto/team.dto';

import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface UpdateBoardServiceInterface {
	update(
		userId: string,
		boardId: string,
		boardData: UpdateBoardDto
	): Promise<LeanDocument<BoardDocument> | null>;

	mergeBoards(subBoardId: string, userId: string): Promise<LeanDocument<BoardDocument> | null>;
	updateChannelId(teams: TeamDto[]);
}
