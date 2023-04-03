import { SessionInterface } from 'src/libs/transactions/session.interface';
import TeamUserDto from '../../dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';

export interface CreateTeamUserServiceInterface extends SessionInterface {
	createTeamUsers(
		teamUsers: TeamUserDto[],
		teamId?: string,
		withSession?: boolean
	): Promise<TeamUser[]>;
	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser>;
}
