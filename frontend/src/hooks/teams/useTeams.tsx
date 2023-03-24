import { useQuery } from '@tanstack/react-query';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '../useTeam';

const useTeams = (isSAdmin: boolean) => {
  const { setToastState } = useTeamUtils();

  return useQuery(
    [TEAMS_KEY],
    () => {
      if (isSAdmin) {
        return getAllTeams();
      }
      return getUserTeams();
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the teams',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );
};

export default useTeams;
