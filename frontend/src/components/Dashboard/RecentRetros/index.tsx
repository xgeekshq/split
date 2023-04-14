import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getDashboardBoardsRequest } from '@/api/boardService';
import EmptyBoards from '@/components/Dashboard/RecentRetros/partials/EmptyBoards';
import ListOfCards from '@/components/Dashboard/RecentRetros/partials/ListOfCards';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';

type RecentRetrosProp = {
  userId: string;
};

const RecentRetros = React.memo<RecentRetrosProp>(({ userId }) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchDashboardBoards = useInfiniteQuery(
    ['boards/dashboard'],
    ({ pageParam = 0 }) => getDashboardBoardsRequest(pageParam),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the boards',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const { data, isFetching } = fetchDashboardBoards;

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
