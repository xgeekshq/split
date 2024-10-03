import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getTeamsWithoutUser } from '@/api/teamService';
import { TEAMS_KEY, USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useTeamsWithoutUser = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchTeamsWithoutUser = useQuery({
    queryKey: [TEAMS_KEY, 'not', USERS_KEY, userId],
    queryFn: () => getTeamsWithoutUser(userId),
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleErrorOnFetchTeamsWithoutUser = () => {
    setToastState(createErrorMessage(ErrorMessages.GET));
  };

  return {
    fetchTeamsWithoutUser,
    handleErrorOnFetchTeamsWithoutUser,
  };
};

export default useTeamsWithoutUser;
