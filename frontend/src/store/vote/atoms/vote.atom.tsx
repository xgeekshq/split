import { atom } from 'recoil';

export const maxVotesReachedAtom = atom<{ maxVotesReached: boolean; noVotes: boolean }>({
  key: 'maxVotesReachedAtom',
  default: { maxVotesReached: false, noVotes: false },
});
