import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import Team from '../../entities/team.schema';

export interface GetTeamServiceInterface {
	getTeam(teamId: string, teamQueryParams?: TeamQueryParams): Promise<Team | null>;
	getTeamsOfUser(userId: string): Promise<Team[]>;
	countAllTeams(): Promise<number>;
	getTeamByName(teamName: string): Promise<Team | null>;
}
