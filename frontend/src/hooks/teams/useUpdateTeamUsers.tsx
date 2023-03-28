import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTeamUsers } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY } from '.';

// CHECK: This Mutation should return the TeamUsers that were added to the Team
// As well as the ids of the TeamUsers removed.
// That would allow us to bypass the sequential requests.
const useUpdateTeamUsers = (teamId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateTeamUsers, {
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
