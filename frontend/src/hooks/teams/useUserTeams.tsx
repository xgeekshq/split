import { useQuery } from '@tanstack/react-query';

import { getUserTeams } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '.';

const useUserTeams = (userId: string) => {
  const { setToastState } = useTeamUtils();

  return useQuery([TEAMS_KEY, 'user', userId], () => getUserTeams(userId), {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUserTeams;
