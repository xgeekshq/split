import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { User } from '../user/user';

export interface TeamUser {
  user: User;
  role: TeamUserRoles;
  isNewJoiner: boolean;
  _id?: string;
  team?: string;
  userCreated?: Date | string;
}

export interface CreateTeamUser {
  user: string; // user._id
  role: TeamUserRoles;
  isNewJoiner?: boolean;
}

export interface TeamUserUpdate {
  role: TeamUserRoles;
  isNewJoiner: boolean;
  user: string;
  team: string;
}
