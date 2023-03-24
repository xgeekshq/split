import { updateTeamUserRequest } from '@/api/teamService';
import { Team } from '@/types/team/team';
import { TeamUserUpdate } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useTeamUtils from '../useTeamUtils';

const useUpdateTeamUser = (teamId: string) => {
  const queryClient = useQueryClient();
  const { setToastState } = useTeamUtils();

  return useMutation(updateTeamUserRequest, {
    onMutate: async (variables: TeamUserUpdate) => {
      const { role, canBeResponsible, isNewJoiner } = variables;
      queryClient.setQueryData(['team', teamId], (old: Team | undefined) => {
        if (old) {
          return {
            ...old,
            users: old.users.map((teamUser) => {
              if (teamUser.user._id === variables.user) {
                return {
                  ...teamUser,
                  role,
                  canBeResponsible,
                  isNewJoiner,
                };
              }

              return teamUser;
            }),
          };
        }

        return old;
      });
      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries(['team', teamId]);
      setToastState({
        open: true,
        content: 'Error while updating the team user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateTeamUser;
