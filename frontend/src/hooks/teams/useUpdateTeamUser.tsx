import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { updateTeamUser } from '@/api/teamService';
import { TEAMS_KEY, USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { TeamUser } from '@/types/team/team.user';

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
      setToastState(createSuccessMessage(SuccessMessages.UPDATE_USER));
    },
    onError: () => {
      queryClient.invalidateQueries([TEAMS_KEY, teamId]);
      queryClient.invalidateQueries([TEAMS_KEY, USERS_KEY, teamId]);

      setToastState(createErrorMessage(ErrorMessages.UPDATE_USER));
    },
  });
};

export default useUpdateTeamUser;
