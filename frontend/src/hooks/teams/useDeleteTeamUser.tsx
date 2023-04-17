import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { deleteTeamUser } from '@/api/teamService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team, TeamChecked } from '@/types/team/team';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const useDeleteTeamUser = (userId: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(deleteTeamUser, {
    onMutate: ({ team: teamId }) => {
      queryClient.setQueryData([TEAMS_KEY, USERS_KEY, userId], (oldTeams: Team[] | undefined) => {
        if (!oldTeams) return oldTeams;

        const removedTeam = oldTeams.find((team) => team.id === teamId);

        queryClient.setQueryData(
          [TEAMS_KEY, 'not', USERS_KEY, userId],
          (oldNotTeams: TeamChecked[] | undefined) => {
            if (!oldNotTeams || !removedTeam) return oldNotTeams;

            const team = {
              _id: removedTeam.id,
              name: removedTeam.name,
            };

            return [...oldNotTeams, team].sort((a, b) => (a.name < b.name ? -1 : 1));
          },
        );

        return oldTeams.filter((team) => team.id !== teamId);
      });
    },
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The user was successfully removed from the team.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries([TEAMS_KEY, USERS_KEY, userId]);
      queryClient.invalidateQueries([TEAMS_KEY, 'not', USERS_KEY, userId]);

      setToastState({
        open: true,
        content: 'Error removing user from the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteTeamUser;
