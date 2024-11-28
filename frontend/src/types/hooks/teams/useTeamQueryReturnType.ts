import { UseQueryResult } from '@tanstack/react-query';

import { Team } from '@/types/team/team';

export type UseTeamQueryReturnType = {
  fetchTeam: UseQueryResult<Team, Error>;
  handleErrorOnFetchTeam: () => void;
};
