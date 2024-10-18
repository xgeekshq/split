import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getTeam } from '@/api/teamService';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useTeam = (teamId: string) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchTeam = useQuery({
    queryKey: [TEAMS_KEY, teamId],
    queryFn: () => getTeam(teamId),
    enabled: !!teamId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleErrorOnFetchTeam = () => {
    setToastState(createErrorMessage(ErrorMessages.GET_ONE));
  };

  return {
    fetchTeam,
    handleErrorOnFetchTeam,
  };
};

export default useTeam;
