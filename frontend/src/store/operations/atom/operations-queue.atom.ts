import { atom } from 'recoil';

export const operationsQueueAtom = atom<Boolean>({
  key: 'usersWithTeams',
  default: true,
});
