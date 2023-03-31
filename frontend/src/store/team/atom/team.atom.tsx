import { atom } from 'recoil';

import { TeamUser } from '../../../types/team/team.user';
import { UserList } from '../../../types/team/userList';

export const usersListState = atom<UserList[]>({
  key: 'usersList',
  default: [],
});

export const createTeamState = atom<TeamUser[]>({
  key: 'createTeamState',
  default: [],
});
