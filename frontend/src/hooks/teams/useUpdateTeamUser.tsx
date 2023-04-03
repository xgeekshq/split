import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTeamUser } from '@/api/teamService';
import { TeamUser } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { Team } from '@/types/team/team';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';

const useUpdateTeamUser = (teamId: string, userId?: string) => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateTeamUser, {
    onMutate: ({ role, canBeResponsible, isNewJoiner, user }) => {
      const updateUserInTeam = (teamUser: TeamUser, id: string) => {
        if (teamUser.user._id !== id) return teamUser;
        return {
          ...teamUser,
          role,
          canBeResponsible,
          isNewJoiner,
        };
      };

      if (userId) {
        queryClient.setQueryData([TEAMS_KEY, USERS_KEY, userId], (oldTeams: Team[] | undefined) => {
          if (!oldTeams) return oldTeams;

          const teamToUpdate = oldTeams.findIndex((team: Team) => team.id === teamId);
          if (teamToUpdate === -1) return oldTeams;

          const updatedOldTeam = oldTeams[teamToUpdate].users.map((teamUser) =>
            updateUserInTeam(teamUser, userId),
          );

          return oldTeams.map((oldTeam) => {
            if (oldTeam.id !== oldTeams[teamToUpdate].id) return oldTeam;
            return {
              ...oldTeams[teamToUpdate],
              users: updatedOldTeam,
            };
          });
        });
      } else {
        queryClient.setQueryData([TEAMS_KEY, teamId], (oldTeam: Team | undefined) => {
          if (!oldTeam) return oldTeam;

          const updatedOldTeam = oldTeam.users.map((teamUser) =>
            updateUserInTeam(teamUser, user as string),
          );

          return {
            ...oldTeam,
            users: updatedOldTeam,
          };
        });
      }
    },
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries([TEAMS_KEY, teamId]);
      queryClient.invalidateQueries([TEAMS_KEY, USERS_KEY, teamId]);

      setToastState({
        open: true,
        content: 'Error while updating the team user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateTeamUser;
