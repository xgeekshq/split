import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import { UserWithTeams } from 'src/modules/users/interfaces/type-user-with-teams';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';

export interface TeamUserRepositoryInterface extends BaseInterfaceRepository<TeamUser> {
	countTeamsOfUser(userId: string): Promise<number>;
	getAllTeamsOfUser(userId: string): Promise<TeamUser[]>;
	getUsersOnlyWithTeams(): Promise<UserWithTeams[]>;
	getUsersOfTeam(teamId: string);
	updateTeamUser(teamData: TeamUserDto): Promise<TeamUser | null>;
}
