import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardType } from 'src/modules/communication/dto/types';

export interface ExecuteCommunicationInterface {
  execute(board: BoardType): Promise<TeamDto[]>;
}
