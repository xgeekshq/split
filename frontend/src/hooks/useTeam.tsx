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
  const {
    teamId,
    setToastState,
    membersList,
    setMembersList,
    queryClient,
    teamsList,
    setTeamsList,
    usersList,
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

  // const getPrevData = async (teamId: string): Promise<TeamUser[]> => {
  //   const query = fetchTeam(teamId);
  //   const teamUsers = await queryClient.cancelQueries(query);
  //   return teamUsers?.users;
  // };

  const addAndRemoveTeamUser = useMutation(addAndRemoveTeamUserRequest, {
    onMutate: async (addedAndRemovedMembers) => {
      await queryClient.cancelQueries(['team', addedAndRemovedMembers.team]);

      // Snapshot the previous value
      const previousTeam = queryClient.getQueryData<Team>(['team', addedAndRemovedMembers.team]);

      // Optimistically update to the new value
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
          setMembersList(finalMembersList);

          return {
            ...oldTeam,
            users: finalMembersList,
          };
        },
      );

      // Return a context object with the snapshotted value
      return { previousTeam };
    },
    onSettled: (data, _error, variables) => {
      queryClient.invalidateQueries(['team', variables.team]);
    },
    // onSuccess: (data) => {
    //   if (!data) return;
    //   // console.log(data);
    //   // console.log(membersList);
    //   // membersList.map((member) => {
    //   //   const letsSee = data.find((user) => {
    //   //     console.log(user.user);
    //   //     return user.user === member.user._id;
    //   //   });
    //   //   console.log(member);
    //   //   console.log(letsSee);
    //   //   return member;
    //   // });
    //   // const finalTT = membersList.map((member) => ({
    //   //   ...member,
    //   //   _id: data.find((user) => user.user === member.user._id)?._id,
    //   // }));
    //   // // console.log('finaList on success', finalTT);
    //   // setMembersList(finalTT);
    // },
    // onSuccess: (data, variables) => {
    //   const removedTeamUserIds = variables.removeUsers;
    //   const createdTeamUsers: CreatedTeamUser[] = data;
    //   const createdTeamUsersWithUser: TeamUser[] = createdTeamUsers.map((teamUser) => ({
    //     ...teamUser,
    //     user: usersList.filter((user) => user._id === teamUser.user)[0],
    //   }));
    //   const usersFromMembersList = membersList.filter(
    //     (member) => !removedTeamUserIds.includes(member._id),
    //   );
    //   const finalMembersList = [...usersFromMembersList, ...createdTeamUsersWithUser];
    //   // updates members from the membersList recoil
    //   setMembersList(finalMembersList);
    //   setToastState({
    //     open: true,
    //     content: 'The team was successfully updated.',
    //     type: ToastStateEnum.SUCCESS,
    //   });
    // },
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
