import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useTeams = (isSAdmin: boolean) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchAllTeams = useQuery({
    queryKey: [TEAMS_KEY],
    queryFn: () => {
      if (isSAdmin) {
        return getAllTeams();
      }
      return getUserTeams();
    },
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleErrorOnFetchAllTeams = () => {
    setToastState(createErrorMessage(ErrorMessages.GET));
  };

  return {
    fetchAllTeams,
    handleErrorOnFetchAllTeams,
  };
};

export default useTeams;
