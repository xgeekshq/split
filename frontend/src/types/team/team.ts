import { CreateTeamUser, TeamUser } from './team.user';

export interface Team {
  id: string;
  name: string;
  users: TeamUser[];
  boardsCount?: number;
}

export interface CreateTeamDto {
  name: string;
  users: CreateTeamUser[];
}

export interface TeamChecked {
  _id: string;
  name: string;
  users: TeamUser[];
  boardsCount?: number;
  isChecked?: boolean;
}
