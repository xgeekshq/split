import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAddTeamsToUser } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { Team } from '@/types/team/team';
import { TEAMS_KEY } from '.';

const useUpdateUserTeams = (userId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateAddTeamsToUser, {
    onSuccess: async (_, variables) => {
      variables.forEach((team) => {
        const teamId = team.team;
        queryClient.setQueryData(
          [TEAMS_KEY, 'not', 'user', userId],
          (oldTeams: Team[] | undefined) => {
            if (!oldTeams) return oldTeams;

            return oldTeams.filter((oldTeam: any) => oldTeam._id !== teamId);
          },
        );
      });
      await queryClient.invalidateQueries([TEAMS_KEY, 'user', userId]);

      setToastState({
        open: true,
        content: 'The team(s) was successfully added to the user.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries([TEAMS_KEY, 'user', userId]);
      queryClient.invalidateQueries([TEAMS_KEY, 'user', 'not', userId]);
      setToastState({
        open: true,
        content: 'Error while adding team(s) to the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateUserTeams;
