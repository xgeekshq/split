import { SessionInterface } from 'src/libs/transactions/session.interface';
import TeamUser from '../../entities/team.user.schema';

export interface DeleteTeamUserServiceInterface extends SessionInterface {
	deleteTeamUser(teamUserId: string, withSession: boolean): Promise<TeamUser>;
	deleteTeamUsersOfUser(userId: string, withSession: boolean): Promise<number>;
	deleteTeamUsers(teamUsers: string[], withSession: boolean): Promise<number>;
	deleteTeamUsersOfTeam(teamId: string, withSession: boolean): Promise<number>;
}
