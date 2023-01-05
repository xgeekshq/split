import { atom } from 'recoil';

export const maxVotesReachedAtom = atom<boolean>({
  key: 'usersWithTeams',
  default: false,
});
