import { atom } from 'recoil';

import { UserList } from '@/types/team/userList';

export const usersListState = atom<UserList[]>({
  key: 'usersList',
  default: [],
});
