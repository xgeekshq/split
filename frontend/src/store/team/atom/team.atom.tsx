import { Team } from '@/types/team/team';
import { atom } from 'recoil';

import { TeamUser } from '../../../types/team/team.user';
import { UserList } from '../../../types/team/userList';

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

//* Guido's Store:
export const createTeamState = atom<TeamUser[]>({
  key: 'createTeamState',
  default: [],
});
