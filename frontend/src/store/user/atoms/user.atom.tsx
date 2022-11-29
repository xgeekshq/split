import { UserWithTeams } from '@/types/user/user';
import { atom } from 'recoil';

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

export const usersWithTeamsState = atom<UserWithTeams[] | undefined>({
  key: 'usersWithTeams',
  default: [],
});
