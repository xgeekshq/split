import { LeanDocument } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import TeamUser from '../../entities/team.user.schema';
import Team from '../../entities/teams.schema';
import { UserWithTeams } from '../../../users/interfaces/type-user-with-teams';
import User from 'src/modules/users/entities/user.schema';

export interface GetTeamServiceInterface {
	countTeams(userId: string): Promise<number>;

	countAllTeams(): Promise<number>;

	getTeamsOfUser(userId: string): Promise<Team[]>;

	getTeam(teamId: string, teamQueryParams?: TeamQueryParams): Promise<Team | null>;

	getUsersOfTeam(teamId: string): Promise<TeamUser[]>;

	getTeamUser(userId: string, teamId: string): Promise<TeamUser | null>;

	getAllTeams(): Promise<LeanDocument<Team>[]>;

	getUsersOnlyWithTeams(users: User[]): Promise<LeanDocument<UserWithTeams>[]>;

	getTeamsUserIsNotMember(userId: string): Promise<LeanDocument<Team>[]>;
}
