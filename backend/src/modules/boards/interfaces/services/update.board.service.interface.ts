import { LeanDocument } from 'mongoose';
import { ColumnDeleteCardsDto } from 'src/libs/dto/colum.deleteCards.dto';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { UpdateColumnDto } from '../../dto/column/update-column.dto';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface UpdateBoardServiceInterface {
	update(boardId: string, boardData: UpdateBoardDto): Promise<LeanDocument<BoardDocument> | null>;

	mergeBoards(subBoardId: string, userId: string): Promise<LeanDocument<BoardDocument> | null>;
	updateChannelId(teams: TeamDto[]);
	updateColumn(
		boardId: string,
		column: UpdateColumnDto
	): Promise<LeanDocument<BoardDocument> | null>;

	deleteCardsFromColumn(
		boardId: string,
		column: ColumnDeleteCardsDto
	): Promise<LeanDocument<BoardDocument> | null>;
}
