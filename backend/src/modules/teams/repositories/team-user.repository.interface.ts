import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import User from 'src/modules/users/entities/user.schema';
import { UserWithTeams } from 'src/modules/users/interfaces/type-user-with-teams';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';

export interface TeamUserRepositoryInterface extends BaseInterfaceRepository<TeamUser> {
	countTeamsOfUser(userId: string): Promise<number>;
	getAllTeamsOfUser(userId: string): Promise<TeamUser[]>;
	getUsersOnlyWithTeams(users: User[]): Promise<UserWithTeams[]>;
	getUsersOfTeam(teamId: string);
	updateTeamUser(teamData: TeamUserDto): Promise<TeamUser | null>;
	deleteManyTeamUser(userId: string, withSession: boolean): Promise<number>;
	deleteTeamOfUserOnly(teamUserId: string, withSession: boolean): Promise<TeamUser>;
}
