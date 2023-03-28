import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTeamUsers } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY } from '.';

const useUpdateTeamUsers = (teamId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateTeamUsers, {
    onSuccess: async () => {
      setToastState({
        open: true,
        content: 'Team member/s successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: async () => {
      setToastState({
        open: true,
        content: 'Error while updating the team.',
        type: ToastStateEnum.ERROR,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([TEAMS_KEY, teamId]);
    },
  });
};

export default useUpdateTeamUsers;
