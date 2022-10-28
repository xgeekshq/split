import BoardDto from '../../dto/board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface Configs {
	recurrent: boolean;
	maxVotes?: number | null;
	hideCards?: boolean;
	hideVotes?: boolean;
	maxUsersPerTeam: number
	slackEnable?: boolean
}

export interface CreateBoardService {
	create(boardData: BoardDto, userId: string): Promise<BoardDocument>;

	splitBoardByTeam(ownerId: string, teamId: string, configs: Configs): Promise<string | null>;
}
