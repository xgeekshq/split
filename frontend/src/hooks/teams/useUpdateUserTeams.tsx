import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAddTeamsToUser } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY } from '.';

// CHECK: This Mutation should return the Team the user was added to.
// Instead atm it returns the TeamUser that was added.
// That would allow us to bypass the sequential requests.
const useUpdateUserTeams = (userId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateAddTeamsToUser, {
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
