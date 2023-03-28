import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTeam } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY } from '.';

const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(deleteTeam, {
    onSuccess: async () => {
      setToastState({
        open: true,
        content: 'The team was successfully deleted.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error deleting the team.',
        type: ToastStateEnum.ERROR,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([TEAMS_KEY]);
    },
  });
};

export default useDeleteTeam;
