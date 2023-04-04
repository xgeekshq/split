import { useQuery } from '@tanstack/react-query';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY } from '@/utils/constants/reactQueryKeys';

const useTeams = (isSAdmin: boolean) => {
  const setToastState = useSetRecoilState(toastState);

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
      refetchOnMount: false,
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
