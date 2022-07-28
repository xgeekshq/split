import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';

export interface ExecuteCommunicationInterface {
	execute(board: BoardType): Promise<TeamDto[]>;
}
