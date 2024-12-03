import { UseQueryResult } from '@tanstack/react-query';

import { Team } from '@/types/team/team';

export type UseUserTeamsQueryReturnType = {
  fetchUserTeams: UseQueryResult<Team[], Error>;
  handleErrorOnFetchUserTeams: () => void;
};
