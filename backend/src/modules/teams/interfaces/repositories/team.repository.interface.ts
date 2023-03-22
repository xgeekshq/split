import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Team from '../../entities/team.schema';

export interface TeamRepositoryInterface extends BaseInterfaceRepository<Team> {
	getTeam(teamId: string): Promise<Team>;
	getTeamsWithUsers(teamIds: string[]): Promise<Team[]>;
	getAllTeams(): Promise<Team[]>;
}
