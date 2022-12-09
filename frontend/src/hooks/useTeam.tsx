import { useMutation, useQuery } from 'react-query';

import { ToastStateEnum } from '@/utils/enums/toast-types';
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
  const {
    teamId,
    setToastState,
    membersList,
    setMembersList,
    queryClient,
    teamsList,
    setTeamsList,
  } = useTeamUtils();

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
    onSuccess: (data) => {
      queryClient.invalidateQueries('team');

      // updates the membersList recoil
      const members = membersList.map((member) =>
        member.user._id === data.user
          ? { ...member, role: data.role, isNewJoiner: data.isNewJoiner }
          : member,
      );

      setMembersList(members);

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
    onSuccess: (data) => {
      // updates members from the membersList recoil
      setMembersList(data.users);

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

  const deleteTeam = useMutation(deleteTeamRequest, {
    onSuccess: (data, variables) => {
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
