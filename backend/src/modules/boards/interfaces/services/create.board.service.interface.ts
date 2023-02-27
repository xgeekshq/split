import { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import BoardDto from '../../dto/board.dto';
import BoardUserDto from '../../dto/board.user.dto';
import { BoardDocument } from '../../entities/board.schema';

export interface Configs {
	recurrent: boolean;
	maxVotes?: number | null;
	hideCards?: boolean;
	hideVotes?: boolean;
	maxUsersPerTeam: number;
	slackEnable?: boolean;
	date?: Date;
	postAnonymously: boolean;
}

export interface CreateBoardService {
	create(boardData: BoardDto, userId: string): Promise<BoardDocument>;

	splitBoardByTeam(ownerId: string, teamId: string, configs: Configs): Promise<string | null>;

	saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string): Promise<BoardUserDocument[]>;

	createBoardUser(board: string, user: string): Promise<BoardUserDocument>;
}
