import { CreateTeamUser, TeamUser } from './team.user';

export interface Team {
	_id: string;
	name: string;
	users: TeamUser[];
}

export interface CreateTeamDto {
	name: string;
	users: CreateTeamUser[];
}
