import { useMutation, useQuery } from 'react-query';

import { ToastStateEnum } from '@/utils/enums/toast-types';
import { TeamUser } from '@/types/team/team.user';
import { Team } from '@/types/team/team';
import {
  addAndRemoveTeamUserRequest,
  createTeamRequest,
  deleteTeamRequest,
  getAllTeams,
  getTeamRequest,
  getTeamsOfUser,
  updateTeamUserRequest,
} from '../api/teamService';
import UseTeamType from '../types/team/useTeam';
import useTeamUtils from './useTeamUtils';

interface AutoFetchProps {
  autoFetchTeam: boolean;
}

const useTeam = ({ autoFetchTeam = false }: AutoFetchProps): UseTeamType => {

  const { teamId, setToastState, queryClient, teamsList, setTeamsList } = useTeamUtils();


  const fetchAllTeams = useQuery(['allTeams'], () => getAllTeams(), {
    enabled: autoFetchTeam,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    },
  });

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
    enabled: autoFetchTeam,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const createTeam = useMutation(createTeamRequest, {
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The team was successfully created.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error creating the board',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const updateTeamUser = useMutation(updateTeamUserRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['team', teamId]);

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
      queryClient.invalidateQueries('teams');

      // updates the teamsList recoil
      const teams = teamsList.filter((team) => team._id !== variables.id);

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

  return {
    fetchAllTeams,
    fetchTeamsOfUser,
    createTeam,
    fetchTeam,
    updateTeamUser,
    addAndRemoveTeamUser,
    deleteTeam,
  };
};

export default useTeam;
