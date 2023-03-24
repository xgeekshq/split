import { useQuery } from '@tanstack/react-query';

import { getTeamsWithoutUser } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '.';

const useTeamsWithoutUser = (userId: string) => {
  const { setToastState } = useTeamUtils();

  return useQuery([TEAMS_KEY, 'not', 'user', userId], () => getTeamsWithoutUser(userId), {
    enabled: true,
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

export default useTeamsWithoutUser;
