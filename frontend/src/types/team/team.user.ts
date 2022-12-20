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

export interface CreatedTeamUser {
  user: string;
  role: TeamUserRoles;
  isNewJoiner: boolean;
  _id: string;
  team?: string;
}

export interface CreateTeamUser {
  user: string; // user._id
  role: TeamUserRoles;
  isNewJoiner: boolean;
  team?: string;
}

export interface TeamUserUpdate {
  role: TeamUserRoles;
  isNewJoiner: boolean;
  user: string | undefined;
  team: string;
}

export interface TeamUserAddAndRemove {
  addUsers: CreateTeamUser[];
  removeUsers: (string | undefined)[];
  team: string;
}
