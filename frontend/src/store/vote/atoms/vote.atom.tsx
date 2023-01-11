import { atom } from 'recoil';

export const maxVotesReachedAtom = atom<{ maxVotesReached: boolean; noVotes: boolean }>({
  key: 'usersWithTeams',
  default: { maxVotesReached: false, noVotes: false },
});
