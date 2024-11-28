import { UseQueryResult } from '@tanstack/react-query';

import { User } from '@/types/user/user';

export type UseUsersQueryReturnType = {
  fetchAllUsers: UseQueryResult<User[], Error>;
  handleErrorOnFetchAllUsers: () => void;
};
