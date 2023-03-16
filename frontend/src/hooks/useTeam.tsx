import { useMutation, useQuery } from '@tanstack/react-query';

import { ToastStateEnum } from '@/utils/enums/toast-types';
import { TeamUser } from '@/types/team/team.user';
import { Team } from '@/types/team/team';
import { AxiosError } from 'axios';
import { INVALID_NAME } from '@/errors/teams/errors';
import {
  addAndRemoveTeamUserRequest,
  createTeamRequest,
  deleteTeamRequest,
  getAllTeams,
  getTeamRequest,
  getTeamsOfUser,
  updateTeamUserRequest,
  deleteTeamUserRequest,
  getTeamsUserIsNotMemberRequest,
  updateAddTeamsToUserRequest,
} from '../api/teamService';
import UseTeamType from '../types/team/useTeam';
import useTeamUtils from './useTeamUtils';

interface AutoFetchProps {
  autoFetchTeam?: boolean;
  autoFetchAllTeams?: boolean;
  autoFetchTeamsOfUser?: boolean;
  autoFetchUserBasedTeams?: boolean;
  autoFetchTeamsOfSpecificUser?: boolean;
  autoFetchTeamsUserIsNotMember?: boolean;
}

const useTeam = ({
  autoFetchTeam = false,
  autoFetchAllTeams = false,
  autoFetchTeamsOfUser = false,
  autoFetchUserBasedTeams = false,
  autoFetchTeamsOfSpecificUser = false,
  autoFetchTeamsUserIsNotMember = false,
}: AutoFetchProps = {}): UseTeamType => {
  const {
    teamId,
    setToastState,
    queryClient,
    teamsList,
    setTeamsList,
    usersList,
    userId,
    session,
  } = useTeamUtils();

  const fetchAllTeams = useQuery(['allTeams'], () => getAllTeams(), {
    enabled: autoFetchAllTeams,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const fetchUserBasedTeams = useQuery(
    ['userBasedTeams'],
    () => {
      if (session?.user.isSAdmin) {
        return getAllTeams();
      }
      return getTeamsOfUser();
    },
    {
      enabled: autoFetchUserBasedTeams,
      refetchOnWindowFocus: false,
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the teams',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const fetchTeam = useQuery(['team', teamId], () => getTeamRequest(teamId), {
    enabled: autoFetchTeam,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the team',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const fetchTeamsOfUser = useQuery(['teams'], () => getTeamsOfUser(), {
    enabled: autoFetchTeamsOfUser,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const fetchTeamsOfSpecificUser = useQuery(
    ['teams', userId],
    () => getTeamsOfUser(userId, undefined),
    {
      enabled: autoFetchTeamsOfSpecificUser,
      refetchOnWindowFocus: false,
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the teams',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const fetchTeamsUserIsNotMember = useQuery(
    ['teamsUserIsNotMember', userId],
    () => getTeamsUserIsNotMemberRequest(userId),
    {
      enabled: autoFetchTeamsUserIsNotMember,
      refetchOnWindowFocus: false,
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the teams',
          type: ToastStateEnum.ERROR,
        });
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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(['team', teamId]),
        queryClient.invalidateQueries(['teams', userId]),
      ]);

      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
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
    onSettled: (data, _error, variables) => {
      queryClient.invalidateQueries(['team', variables.team]);
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
      queryClient.invalidateQueries(['teams']);

      // updates the teamsList recoil
      const teams = teamsList.filter((team) => team.id !== variables.id);

      setTeamsList(teams);

      setToastState({
        open: true,
        content: 'The team was successfully deleted.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error deleting the team',
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
        content: 'The team was successfully deleted.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error deleting the team user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    fetchAllTeams,
    fetchUserBasedTeams,
    fetchTeamsOfUser,
    createTeam,
    fetchTeam,
    updateTeamUser,
    addAndRemoveTeamUser,
    deleteTeam,
    deleteTeamUser,
    fetchTeamsOfSpecificUser,
    fetchTeamsUserIsNotMember,
    updateAddTeamsToUser,
  };
};

export default useTeam;
