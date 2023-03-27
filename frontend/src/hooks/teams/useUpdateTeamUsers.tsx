import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addAndRemoveTeamUserRequest } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '.';

const useUpdateTeamUsers = (teamId: string) => {
  const queryClient = useQueryClient();
  const { setToastState } = useTeamUtils();

  return useMutation(addAndRemoveTeamUserRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([TEAMS_KEY, teamId]);

      setToastState({
        open: true,
        content: 'Team member/s successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: async () => {
      await queryClient.invalidateQueries([TEAMS_KEY, teamId]);

      setToastState({
        open: true,
        content: 'Error while updating the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateTeamUsers;
