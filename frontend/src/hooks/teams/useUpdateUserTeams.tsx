import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { updateAddTeamsToUser } from '@/api/teamService';
import { TEAMS_KEY, USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';

const useUpdateUserTeams = (userId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation({
    mutationFn: updateAddTeamsToUser,
    onMutate: (teams) => {
      teams.forEach(({ team: teamId }) => {
        queryClient.setQueryData(
          [TEAMS_KEY, 'not', USERS_KEY, userId],
          (oldTeams: Team[] | undefined) => {
            if (!oldTeams) return oldTeams;

            return oldTeams.filter((oldTeam: any) => oldTeam._id !== teamId);
          },
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEAMS_KEY, USERS_KEY, userId] });

      setToastState(createSuccessMessage(SuccessMessages.UPDATE_TEAM));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [TEAMS_KEY, USERS_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [TEAMS_KEY, 'not', USERS_KEY, userId] });
      setToastState(createErrorMessage(ErrorMessages.UPDATE_TEAM));
    },
  });
};

export default useUpdateUserTeams;
