import { AxiosError } from 'axios';

import { INVALID_NAME } from '@/errors/teams/errors';
import { Team } from '@/types/team/team';
import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { ROUTES } from '@/utils/routes';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getUserTeams,
  getTeam,
  getTeamsWithoutUser,
  addAndRemoveTeamUserRequest,
  createTeamRequest,
  deleteTeamUserRequest,
  updateAddTeamsToUserRequest,
  updateTeamUserRequest,
} from '../api/teamService';
import UseTeamType from '../types/team/useTeam';
import useTeamUtils from './useTeamUtils';

interface AutoFetchProps {
  enableFetchTeam?: boolean;
  enableFetchUserTeams?: boolean;
  enableFetchTeamsWithoutUser?: boolean;
}

export const TEAMS_KEY: string = 'teams';
const TEAM_STALE_TIME: number = 1000 * 60;

const useTeam = ({
  enableFetchTeam = false,
  enableFetchUserTeams = false,
  enableFetchTeamsWithoutUser = false,
}: AutoFetchProps = {}): UseTeamType => {
  const {
    teamId,
    setToastState,
    queryClient,
    usersList,
    userId,
    router: { push },
  } = useTeamUtils();

  const displayToast = (content: string, type: ToastStateEnum) => {
    setToastState({
      open: true,
      content,
      type,
    });
  };

  const fetchTeam = useQuery([TEAMS_KEY, teamId], () => getTeam(teamId), {
    enabled: enableFetchTeam,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: TEAM_STALE_TIME,
    onError: () => {
      displayToast('Error getting the team', ToastStateEnum.ERROR);
    },
  });

  const fetchUserTeams = useQuery([TEAMS_KEY, 'user', userId], () => getUserTeams(userId), {
    enabled: enableFetchUserTeams,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: TEAM_STALE_TIME,
    onError: () => {
      displayToast('Error getting the teams', ToastStateEnum.ERROR);
    },
  });

  const fetchTeamsWithoutUser = useQuery(
    [TEAMS_KEY, 'not', 'user', userId],
    () => getTeamsWithoutUser(userId),
    {
      enabled: enableFetchTeamsWithoutUser,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: TEAM_STALE_TIME,
      onError: () => {
        displayToast('Error getting the teams', ToastStateEnum.ERROR);
      },
    },
  );

  const createTeam = useMutation(createTeamRequest, {
    onSuccess: () => {
      displayToast('The team was successfully created.', ToastStateEnum.SUCCESS);
      // CHECK: Should this Hook be responsible for changing the Page?
      push(ROUTES.Teams);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      displayToast(
        error.response?.data.message === 'INVALID_NAME' ? INVALID_NAME : 'Error creating the team',
        ToastStateEnum.ERROR,
      );
    },
  });

  const updateTeamUser = useMutation(updateTeamUserRequest, {
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

  const updateAddTeamsToUser = useMutation(updateAddTeamsToUserRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['teams', userId]);

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

  const addAndRemoveTeamUser = useMutation(addAndRemoveTeamUserRequest, {
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

  const deleteTeamUser = useMutation(deleteTeamUserRequest, {
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(['teams', userId]),
        queryClient.invalidateQueries(['teamsUserIsNotMember', userId]),
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

  return {
    fetchTeam,
    fetchUserTeams,
    fetchTeamsWithoutUser,

    createTeam,
    updateTeamUser,
    addAndRemoveTeamUser,
    deleteTeamUser,
    updateAddTeamsToUser,
  };
};

export const useDeleteTeamUser = () => {
  const { queryClient, setToastState } = useTeamUtils();

  return useMutation(deleteTeamUserRequest, {
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries([TEAMS_KEY, variables.teamUserId]),
        queryClient.invalidateQueries([TEAMS_KEY, 'not', 'user', variables.teamUserId]),
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

export default useTeam;
