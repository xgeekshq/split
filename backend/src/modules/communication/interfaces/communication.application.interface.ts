import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardType, SlackMessageType } from 'src/modules/communication/dto/types';

export interface CommunicationApplicationInterface {
	execute(board: BoardType): Promise<TeamDto[]>;
	postMessageOnChannel(slackMessage: SlackMessageType): Promise<void>;
}
