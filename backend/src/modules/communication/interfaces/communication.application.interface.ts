import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardType } from 'src/modules/communication/dto/types';

export interface CommunicationApplicationInterface {
	execute(board: BoardType): Promise<TeamDto[]>;
}
