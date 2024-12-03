import { useInfiniteQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getUsersWithTeams } from '@/api/userService';
import { TEAMS_KEY, USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/users-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useUsersWithTeams = (searchParam?: string) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchUsersWithTeams = useInfiniteQuery({
    queryKey: [USERS_KEY, TEAMS_KEY],
    queryFn: ({ pageParam = 0 }) => getUsersWithTeams(pageParam, searchParam ?? ''),
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { hasNextPage, page } = lastPage;
      if (hasNextPage) return page + 1;
      return undefined;
    },
  });

  const handleErrorOnFetchUsersWithTeams = () => {
    setToastState(createErrorMessage(ErrorMessages.GET));
  };

  return {
    fetchUsersWithTeams,
    handleErrorOnFetchUsersWithTeams,
  };
};

export default useUsersWithTeams;
