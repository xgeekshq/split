import { TeamDto } from 'src/modules/communication/dto/team.dto';

export interface UpdateBoardServiceInterface {
	updateChannelId(teams: TeamDto[]);
}
