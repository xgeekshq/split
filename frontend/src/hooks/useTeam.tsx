import { useMutation, useQuery } from 'react-query';

import { ToastStateEnum } from 'utils/enums/toast-types';
import { createTeamRequest, getAllTeams, getTeamRequest, getTeamsOfUser } from '../api/teamService';
import UseTeamType from '../types/team/useTeam';
import useTeamUtils from './useTeamUtils';

interface AutoFetchProps {
	autoFetchTeam: boolean;
}

const useTeam = ({ autoFetchTeam = false }: AutoFetchProps): UseTeamType => {
	const { teamId, setToastState } = useTeamUtils();

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

	const fetchTeam = useQuery(['team', teamId], () => getTeamRequest(teamId as string), {
		enabled: autoFetchTeam,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the team',
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
		createTeam,
		fetchTeam
	};
};

export default useTeam;
