import { SessionInterface } from 'src/libs/transactions/session.interface';
import TeamUserDto from '../../dto/team.user.dto';
import TeamUser from '../../entities/team.user.schema';

export interface CreateTeamUserServiceInterface extends SessionInterface {
	createTeamUsers(teamUsers: TeamUserDto[], teamId?: string): Promise<TeamUser[]>;
	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser>;
}
