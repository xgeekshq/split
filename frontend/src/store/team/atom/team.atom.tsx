import { Team } from '@/types/team/team';
import { atom } from 'recoil';

import { TeamUser } from '../../../types/team/team.user';
import { UserList } from '../../../types/team/userList';

export const membersListState = atom<TeamUser[]>({
  key: 'membersList',
  default: [],
});

export const usersListState = atom<UserList[]>({
  key: 'usersList',
  default: [],
});

export const teamsListState = atom<Team[]>({
  key: 'teamsList',
  default: [],
});

export const teamsOfUser = atom<Team[]>({
  key: 'teamsOfUser',
  default: [],
});

export const userTeamsListState = atom<Team[]>({
  key: 'userTeamsList',
  default: [],
});
