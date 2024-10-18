import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getUserTeams } from '@/api/teamService';
import { TEAMS_KEY, USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useUserTeams = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchUserTeams = useQuery({
    queryKey: [TEAMS_KEY, USERS_KEY, userId],
    queryFn: () => getUserTeams(userId),
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleErrorOnFetchUserTeams = () => {
    setToastState(createErrorMessage(ErrorMessages.GET));
  };

  return {
    fetchUserTeams,
    handleErrorOnFetchUserTeams,
  };
};

export default useUserTeams;
