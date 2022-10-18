import { getAllTeams, getTeamsOfUser } from 'api/teamService';
import React from 'react';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';

import { toastState } from 'store/toast/atom/toast.atom';
import { ToastStateEnum } from 'utils/enums/toast-types';
import EmptyTeams from './partials/EmptyTeams';
import ListOfCards from './partials/ListOfCards';

type MyTeamsProps = {
	userId: string;
};

const MyTeams = ({ userId }: MyTeamsProps) => {
	const setToastState = useSetRecoilState(toastState);

	const { data, isFetching } = useQuery(['teams'], () => getAllTeams(), {
		enabled: true,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the teams',
				type: ToastStateEnum.ERROR
			});
		}
	});

	if (!data) return <EmptyTeams />;

	return <ListOfCards teams={data} isLoading={isFetching} userId={userId} />;
};

export default MyTeams;
