import { UseQueryResult } from '@tanstack/react-query';

import { TeamChecked } from '@/types/team/team';

export type UseTeamsWithoutUserQueryReturnType = {
  fetchTeamsWithoutUser: UseQueryResult<TeamChecked[], Error>;
  handleErrorOnFetchTeamsWithoutUser: () => void;
};
