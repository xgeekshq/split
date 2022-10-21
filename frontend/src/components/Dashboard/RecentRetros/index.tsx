import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';

import { getDashboardBoardsRequest } from 'api/boardService';
import { useSocketBoardIO } from 'hooks/useSocketBoardIO';
import { toastState } from 'store/toast/atom/toast.atom';
import { ToastStateEnum } from 'utils/enums/toast-types';
import isEmpty from 'utils/isEmpty';
import EmptyBoards from './partials/EmptyBoards';
import ListOfCards from './partials/ListOfCards';

type RecentRetrosProp = {
	userId: string;
};

const RecentRetros = React.memo<RecentRetrosProp>(({ userId }) => {
	const setToastState = useSetRecoilState(toastState);

	const fetchDashboardBoards = useInfiniteQuery(
		'boards/dashboard',
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
					type: ToastStateEnum.ERROR
				});
			}
		}
	);

	const { data, isFetching } = fetchDashboardBoards;

	const teamSocketId = data?.pages[0].boards[0].team._id;

	// socketId
	const { socket, queryClient } = useSocketBoardIO(teamSocketId);
	useEffect(() => {
		if (!socket) return;
		socket.on('teamId', () => {
			queryClient.invalidateQueries('boards/dashboard');
		});
	}, [socket, queryClient]);
	if (!data || isEmpty(data?.pages[0].boards)) return <EmptyBoards />;

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
