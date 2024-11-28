import { UseQueryResult } from '@tanstack/react-query';

import { User } from '@/types/user/user';

export type UseUserQueryReturnType = {
  fetchUser: UseQueryResult<User, Error>;
  handleOnErrorFetchUser: () => void;
};
