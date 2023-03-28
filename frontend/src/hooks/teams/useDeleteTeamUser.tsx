import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTeamUser } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY } from '.';

const useDeleteTeamUser = (userId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(deleteTeamUser, {
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries([TEAMS_KEY, 'user', userId]),
        queryClient.invalidateQueries([TEAMS_KEY, 'not', 'user', userId]),
      ]);

      setToastState({
        open: true,
        content: 'The user was successfully removed from the team.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error removing user from the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteTeamUser;
