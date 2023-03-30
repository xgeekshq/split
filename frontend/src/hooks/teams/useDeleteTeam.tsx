import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTeam } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';

import { TEAMS_KEY } from '.';

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
      setToastState({
        open: true,
        content: 'The team was successfully deleted.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries([TEAMS_KEY]);
      setToastState({
        open: true,
        content: 'Error deleting the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteTeam;
