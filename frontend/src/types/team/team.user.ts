import { TeamUserRoles } from 'utils/enums/team.user.roles';
import { User } from '../user/user';

export interface TeamUser {
	user: User;
	role: TeamUserRoles;
	_id: string;
	team: string;
}

export interface CreateTeamUser {
	user: string; // user._id
	role: TeamUserRoles;
}
