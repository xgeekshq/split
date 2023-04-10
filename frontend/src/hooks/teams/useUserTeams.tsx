import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getUserTeams } from '@/api/teamService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const useUserTeams = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery([TEAMS_KEY, USERS_KEY, userId], () => getUserTeams(userId), {
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
