import { GetServerSidePropsContext } from 'next';

import { CreateTeamDto, Team } from '@/types/team/team';
import fetchData from '@/utils/fetchData';
import {
  CreatedTeamUser,
  DeleteTeamUser,
  TeamUser,
  TeamUserAddAndRemove,
  TeamUserUpdate,
} from '../types/team/team.user';

// #region GET
export const getAllTeams = (context?: GetServerSidePropsContext): Promise<Team[]> =>
  fetchData(`/teams`, { context, serverSide: !!context });

export const getUserTeams = (
  userId?: string,
  context?: GetServerSidePropsContext,
): Promise<Team[]> =>
  fetchData(`/teams/user${userId ? `?userId=${userId}` : ''}`, { context, serverSide: !!context });

export const getTeam = (id: string, context?: GetServerSidePropsContext): Promise<Team> =>
  fetchData(`/teams/${id}`, { context, serverSide: !!context });

export const getTeamsWithoutUser = (userId?: string): Promise<Team[]> =>
  fetchData(`/teams/not/${userId}`);
// #endregion

// #region POST
export const createTeamRequest = (newTeam: CreateTeamDto): Promise<Team> =>
  fetchData(`/teams`, { method: 'POST', data: newTeam });
// #endregion

// #region PUT
export const updateTeamUserRequest = (team: TeamUserUpdate): Promise<TeamUser> =>
  fetchData(`/teams/${team.team}`, { method: 'PUT', data: team });

export const addAndRemoveTeamUserRequest = (
  users: TeamUserAddAndRemove,
): Promise<CreatedTeamUser[]> =>
  fetchData(`/teams/${users.team}/addAndRemove`, { method: 'PUT', data: users });

export const updateAddTeamsToUserRequest = (teamUser: TeamUserUpdate[]): Promise<TeamUserUpdate> =>
  fetchData(`/teams/add/user`, { method: 'PUT', data: teamUser });
// #endregion

// #region DELETE
export const deleteTeam = (id: string): Promise<Team> =>
  fetchData(`/teams/${id}`, { method: 'DELETE' });

export const deleteTeamUserRequest = (teamOfUserToDelete: DeleteTeamUser): Promise<TeamUser> =>
  fetchData(`/teams/user/${teamOfUserToDelete.teamUserId}`, {
    method: 'DELETE',
  });
// #endregion
