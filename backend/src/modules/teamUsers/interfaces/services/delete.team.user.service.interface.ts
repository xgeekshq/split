import { SessionInterface } from 'src/libs/transactions/session.interface';

export interface DeleteTeamUserServiceInterface extends SessionInterface {
	deleteTeamUsersOfUser(userId: string, withSession: boolean): Promise<number>;
	deleteTeamUsers(teamUsers: string[], withSession: boolean): Promise<number>;
	deleteTeamUsersOfTeam(teamId: string, withSession: boolean): Promise<boolean>;
}
