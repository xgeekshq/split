import { UseQueryResult } from '@tanstack/react-query';

import { Team } from '@/types/team/team';

export type UseTeamsQueryReturnType = {
  fetchAllTeams: UseQueryResult<Team[], Error>;
  handleErrorOnFetchAllTeams: () => void;
};
