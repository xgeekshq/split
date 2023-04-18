import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { deleteTeam } from '@/api/teamService';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';

const useDeleteTeam = (teamId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(deleteTeam, {
    onMutate: () => {
      queryClient.setQueryData([TEAMS_KEY], (oldTeams: Team[] | undefined) => {
        if (!oldTeams) return oldTeams;

        return oldTeams.filter((team) => team.id !== teamId);
      });
    },
    onSuccess: () => {
      setToastState(createSuccessMessage(SuccessMessages.DELETE));
    },
    onError: () => {
      queryClient.invalidateQueries([TEAMS_KEY]);
      setToastState(createErrorMessage(ErrorMessages.DELETE));
    },
  });
};

export default useDeleteTeam;
