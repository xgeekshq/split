import { atom } from 'recoil';

import { UserWithTeams } from '@/types/user/user';

export const userState = atom({
  key: 'user',
  default: {
    firstName: '',
    lastName: '',
    email: '',
    id: '',
    strategy: '',
  },
});

export const usersWithTeamsState = atom<UserWithTeams[]>({
  key: 'usersWithTeams',
  default: [],
});
