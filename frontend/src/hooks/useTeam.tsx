import { AxiosError } from 'axios';

import { INVALID_NAME } from '@/errors/teams/errors';
import { Team } from '@/types/team/team';
import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { ROUTES } from '@/utils/routes';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getAllTeams,
  getUserTeams,
  getTeam,
  getTeamsWithoutUser,
  addAndRemoveTeamUserRequest,
  createTeamRequest,
  deleteTeamRequest,
  deleteTeamUserRequest,
  updateAddTeamsToUserRequest,
  updateTeamUserRequest,
} from '../api/teamService';
import UseTeamType from '../types/team/useTeam';
import useTeamUtils from './useTeamUtils';

interface AutoFetchProps {
  enableFetchTeams?: boolean;
  enableFetchTeam?: boolean;
  enableFetchUserTeams?: boolean;
  enableFetchTeamsWithoutUser?: boolean;
}

export const TEAMS_KEY: string = 'teams';
const TEAM_STALE_TIME: number = 1000 * 60;

export const fetchTeamsFn = (isSAdmin: boolean) => {
  if (isSAdmin) {
    return getAllTeams();
  }
  return getUserTeams();
};

const useTeam = ({
  enableFetchTeams = false,
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
    isSAdmin,
  } = useTeamUtils();

  const displayToast = (text: string) => {
    setToastState({
      open: true,
      content: text,
      type: ToastStateEnum.ERROR,
    });
  };

  const fetchTeams = useQuery([TEAMS_KEY], () => fetchTeamsFn(isSAdmin), {
    enabled: enableFetchTeams,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: TEAM_STALE_TIME,
    onError: () => {
      displayToast('Error getting the teams');
    },
  });

  const fetchTeam = useQuery([TEAMS_KEY, teamId], () => getTeam(teamId), {
    enabled: enableFetchTeam,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: TEAM_STALE_TIME,
    onError: () => {
      displayToast('Error getting the team');
    },
  });

  const fetchUserTeams = useQuery([TEAMS_KEY, 'user', userId], () => getUserTeams(userId), {
    enabled: enableFetchUserTeams,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: TEAM_STALE_TIME,
    onError: () => {
      displayToast('Error getting the teams');
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
        displayToast('Error getting the teams');
      },
    },
  );

  const createTeam = useMutation(createTeamRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);

      setToastState({
        open: true,
        content: 'The team was successfully created.',
        type: ToastStateEnum.SUCCESS,
      });

      push(ROUTES.Teams);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setToastState({
        open: true,
        content:
          error.response?.data.message === 'INVALID_NAME'
            ? INVALID_NAME
            : 'Error creating the team',
        type: ToastStateEnum.ERROR,
      });
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

  const deleteTeam = useMutation(deleteTeamRequest, {
    onSuccess: (_data, variables) => {
      // Remove Deleted Team from Cache
      queryClient.setQueryData(['userBasedTeams'], (oldTeams?: Team[]) => {
        if (oldTeams) return oldTeams.filter((team: Team) => team.id !== variables.id);
        return oldTeams;
      });

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
    fetchTeams,
    fetchTeam,
    fetchUserTeams,
    fetchTeamsWithoutUser,

    createTeam,
    updateTeamUser,
    addAndRemoveTeamUser,
    deleteTeam,
    deleteTeamUser,
    updateAddTeamsToUser,
  };
};

export default useTeam;
