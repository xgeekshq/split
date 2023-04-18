import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getTeamsWithoutUser } from '@/api/teamService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';

const useTeamsWithoutUser = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery([TEAMS_KEY, 'not', USERS_KEY, userId], () => getTeamsWithoutUser(userId), {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.GET));
    },
  });
};

export default useTeamsWithoutUser;
