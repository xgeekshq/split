import TeamUser from '../../entities/team.user.schema';
import { UserWithTeams } from '../../../users/interfaces/type-user-with-teams';
import User from 'src/modules/users/entities/user.schema';

export interface GetTeamUserServiceInterface {
	countTeamsOfUser(userId: string): Promise<number>;
	getAllTeamsOfUser(userId: string): Promise<TeamUser[]>;
	getUsersOnlyWithTeams(users: User[]): Promise<UserWithTeams[]>;
	getTeamUser(userId: string, teamId: string): Promise<TeamUser>;
	getUsersOfTeam(teamId: string): Promise<TeamUser[]>;
}
