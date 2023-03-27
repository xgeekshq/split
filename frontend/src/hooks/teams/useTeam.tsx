import { useQuery } from '@tanstack/react-query';

import { getTeam } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '.';

const useTeam = (teamId: string) => {
  const { setToastState } = useTeamUtils();

  return useQuery([TEAMS_KEY, teamId], () => getTeam(teamId), {
    enabled: !!teamId,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the team',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useTeam;
