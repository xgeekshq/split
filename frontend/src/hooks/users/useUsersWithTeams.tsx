import { useInfiniteQuery } from '@tanstack/react-query';

import { getUsersWithTeams } from '@/api/userService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';

const useUsersWithTeams = (searchParam?: string) => {
  const setToastState = useSetRecoilState(toastState);

  return useInfiniteQuery(
    [USERS_KEY, TEAMS_KEY],
    ({ pageParam = 0 }) => getUsersWithTeams(pageParam, searchParam ?? ''),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the users',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );
};

export default useUsersWithTeams;
