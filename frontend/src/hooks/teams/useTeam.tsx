import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getTeam } from '@/api/teamService';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useTeam = (teamId: string) => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery([TEAMS_KEY, teamId], () => getTeam(teamId), {
    enabled: !!teamId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.GET_ONE));
    },
  });
};

export default useTeam;
