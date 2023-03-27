import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addAndRemoveTeamUserRequest } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { Team } from '@/types/team/team';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '.';

const useUpdateTeamUsers = (teamId: string) => {
  const queryClient = useQueryClient();
  const { setToastState } = useTeamUtils();

  return useMutation(addAndRemoveTeamUserRequest, {
    onMutate: () => {
      const previousTeam = queryClient.getQueryData<Team>([TEAMS_KEY, teamId]);
      return { previousTeam };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([TEAMS_KEY, teamId]);
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData([TEAMS_KEY, teamId], context?.previousTeam);
      setToastState({
        open: true,
        content: 'Error while updating the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateTeamUsers;
