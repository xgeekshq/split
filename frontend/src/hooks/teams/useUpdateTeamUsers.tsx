import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { updateTeamUsers } from '@/api/teamService';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useUpdateTeamUsers = (teamId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateTeamUsers, {
    onSuccess: () => {
      setToastState(createSuccessMessage(SuccessMessages.UPDATE));
    },
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.UPDATE));
    },
    onSettled: () => {
      queryClient.invalidateQueries([TEAMS_KEY, teamId]);
    },
  });
};

export default useUpdateTeamUsers;
