import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getDashboardBoardsRequest } from '@/api/boardService';
import EmptyBoards from '@/components/Dashboard/RecentRetros/partials/EmptyBoards';
import ListOfCards from '@/components/Dashboard/RecentRetros/partials/ListOfCards';
import { createErrorMessage } from '@/constants/toasts';
import { toastState } from '@/store/toast/atom/toast.atom';
import isEmpty from '@/utils/isEmpty';

type RecentRetrosProp = {
  userId: string;
};

const RecentRetros = React.memo<RecentRetrosProp>(({ userId }) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchDashboardBoards = useInfiniteQuery({
    queryKey: ['boards/dashboard'],
    queryFn: ({ pageParam }) => getDashboardBoardsRequest(pageParam),
    enabled: true,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      const { hasNextPage, page } = lastPage;
      if (hasNextPage) return page + 1;
      return undefined;
    },
    initialPageParam: 0,
  });

  const { data, isFetching, isError } = fetchDashboardBoards;

  if (isError) {
    setToastState(createErrorMessage('Error getting the boards'));
  }

  if (!isFetching && (!data || isEmpty(data?.pages[0].boards))) return <EmptyBoards />;
  return (
    <ListOfCards
      data={data}
      fetchBoards={fetchDashboardBoards}
      isLoading={isFetching}
      userId={userId}
    />
  );
});

export default RecentRetros;
