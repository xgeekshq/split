import { useMutation, useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';

import { ToastStateEnum } from 'utils/enums/toast-types';
import { createTeamRequest, getAllTeams, getTeamsOfUser } from '../api/teamService';
import { toastState } from '../store/toast/atom/toast.atom';
import UseTeamType from '../types/team/useTeam';

interface AutoFetchProps {
	autoFetchTeam: boolean;
}

const useTeam = ({ autoFetchTeam = false }: AutoFetchProps): UseTeamType => {
	const setToastState = useSetRecoilState(toastState);
	const fetchAllTeams = useQuery(['allTeams'], () => getAllTeams(), {
		enabled: autoFetchTeam,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the teams',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const fetchTeamsOfUser = useQuery(['teams'], () => getTeamsOfUser(), {
		enabled: autoFetchTeam,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the teams',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const createTeam = useMutation(createTeamRequest, {
		onSuccess: () => {
			setToastState({
				open: true,
				content: 'The team was successfully created.',
				type: ToastStateEnum.SUCCESS
			});
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error creating the board',
				type: ToastStateEnum.ERROR
			});
		}
	});

	return {
		fetchAllTeams,
		fetchTeamsOfUser,
		createTeam
	};
};

export default useTeam;
