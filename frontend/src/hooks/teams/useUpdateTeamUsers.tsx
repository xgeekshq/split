import { addAndRemoveTeamUserRequest } from '@/api/teamService';
import { Team } from '@/types/team/team';
import { TeamUser } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useTeamUtils from '../useTeamUtils';

const useUpdateTeamUsers = () => {
  const queryClient = useQueryClient();
  const { setToastState, usersList } = useTeamUtils();

  return useMutation(addAndRemoveTeamUserRequest, {
    onMutate: async (addedAndRemovedMembers) => {
      await queryClient.cancelQueries(['team', addedAndRemovedMembers.team]);

      const previousTeam = queryClient.getQueryData<Team>(['team', addedAndRemovedMembers.team]);

      queryClient.setQueryData<Team | undefined>(
        ['team', addedAndRemovedMembers.team],
        (oldTeam: Team | undefined) => {
          if (!oldTeam) return oldTeam;
          const removedTeamUserIds = addedAndRemovedMembers.removeUsers;
          const createdTeamUsersWithUser: TeamUser[] = addedAndRemovedMembers.addUsers.map(
            (teamUser) => ({
              ...teamUser,
              user: usersList.filter((user) => user._id === teamUser.user)[0],
            }),
          );
          const usersFromMembersList = oldTeam.users.filter(
            (member) => !removedTeamUserIds.includes(member._id),
          );

          const finalMembersList: TeamUser[] = [
            ...usersFromMembersList,
            ...createdTeamUsersWithUser,
          ];

          setToastState({
            open: true,
            content: 'The team was successfully updated.',
            type: ToastStateEnum.SUCCESS,
          });

          return {
            ...oldTeam,
            users: finalMembersList,
          };
        },
      );

      return { previousTeam };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['team', variables.team], context?.previousTeam);
      setToastState({
        open: true,
        content: 'Error while updating the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUpdateTeamUsers;
