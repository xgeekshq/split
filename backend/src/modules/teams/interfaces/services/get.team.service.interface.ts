import { LeanDocument } from 'mongoose';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import Team from '../../entities/teams.schema';
import UserDto from 'src/modules/users/dto/user.dto';

export interface GetTeamServiceInterface {
	getAllTeams(user: UserDto): Promise<LeanDocument<Team>[]>;
	getTeam(teamId: string, teamQueryParams?: TeamQueryParams): Promise<Team | null>;
	getTeamsOfUser(userId: string): Promise<Team[]>;
	getTeamsUserIsNotMember(userId: string): Promise<LeanDocument<Team>[]>;
	countAllTeams(): Promise<number>;
}
