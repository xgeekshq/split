import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';

export interface UpdateBoardServiceInterface {
	//mergeBoards(subBoardId: string, userId: string, socketId?: string): Promise<Board> | null;

	updateChannelId(teams: TeamDto[]);

	updatePhase(payload: BoardPhaseDto);
}
