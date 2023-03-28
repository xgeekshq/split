import { updateAddTeamsToUserRequest } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TEAMS_KEY } from '.';
import useTeamUtils from '../useTeamUtils';

const useUpdateUserTeams = (userId: string) => {
  const queryClient = useQueryClient();
  const { setToastState } = useTeamUtils();

  return useMutation(updateAddTeamsToUserRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([TEAMS_KEY, 'user', userId]);

      setToastState({
        open: true,
        content: 'The team(s) was successfully added to the user.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error while adding team(s) to the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateUserTeams;
