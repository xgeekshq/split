import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';

export interface CommunicationApplicationInterface {
	execute(board: BoardType): Promise<TeamDto[]>;
}
