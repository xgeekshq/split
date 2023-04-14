import { GetServerSidePropsContext } from 'next';

import { CreateTeamDto, Team, TeamChecked } from '@/types/team/team';
import {
  CreatedTeamUser,
  TeamUser,
  TeamUserAddAndRemove,
  TeamUserUpdate,
} from '@/types/team/team.user';
import fetchData from '@/utils/fetchData';

// #region GET
export const getAllTeams = (context?: GetServerSidePropsContext): Promise<Team[]> =>
  fetchData(`/teams`, { context, serverSide: !!context });

export const getUserTeams = (
  userId?: string,
  context?: GetServerSidePropsContext,
): Promise<Team[]> =>
  fetchData(`/teams/user${userId ? `?userId=${userId}` : ''}`, { context, serverSide: !!context });

export const getTeam = (teamId: string, context?: GetServerSidePropsContext): Promise<Team> =>
  fetchData(`/teams/${teamId}`, { context, serverSide: !!context });

export const getTeamsWithoutUser = (
  userId: string,
  context?: GetServerSidePropsContext,
): Promise<TeamChecked[]> => fetchData(`/teams/not/${userId}`, { context, serverSide: !!context });
// #endregion

// #region POST
export const createTeamRequest = (newTeam: CreateTeamDto): Promise<Team> =>
  fetchData(`/teams`, { method: 'POST', data: newTeam });
// #endregion

// #region PUT
export const updateTeamUser = (team: TeamUserUpdate): Promise<TeamUserUpdate> =>
  fetchData(`/teams/${team.team}`, { method: 'PUT', data: team });

export const updateTeamUsers = (users: TeamUserAddAndRemove): Promise<CreatedTeamUser[]> =>
  fetchData(`/teams/${users.team}/addAndRemove`, { method: 'PUT', data: users });

export const updateAddTeamsToUser = (teamUser: TeamUserUpdate[]): Promise<TeamUserUpdate> =>
  fetchData(`/teams/add/user`, { method: 'PUT', data: teamUser });
// #endregion

// #region DELETE
export const deleteTeam = (teamId: string): Promise<Team> =>
  fetchData(`/teams/${teamId}`, { method: 'DELETE' });

export const deleteTeamUser = (teamUser: TeamUser): Promise<TeamUser> =>
  fetchData(`/teams/user/${teamUser._id}`, {
    method: 'DELETE',
  });
// #endregion
