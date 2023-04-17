import { atom } from 'recoil';

import { TeamUser } from '@/types/team/team.user';

export const createTeamState = atom<TeamUser[]>({
  key: 'createTeamState',
  default: [],
});
