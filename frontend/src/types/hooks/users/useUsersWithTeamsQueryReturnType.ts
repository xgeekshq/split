import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import { InfiniteUsersWithTeams } from '@/types/user/user';

export type UseUsersWithTeamsQueryReturnType = {
  fetchUsersWithTeams: UseInfiniteQueryResult<InfiniteData<InfiniteUsersWithTeams, unknown>, Error>;
  handleErrorOnFetchUsersWithTeams: () => void;
};
