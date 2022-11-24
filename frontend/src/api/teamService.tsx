import { GetServerSidePropsContext } from 'next';

import { CreateTeamDto, Team } from 'types/team/team';
import fetchData from 'utils/fetchData';
import { TeamUserUpdate } from '../types/team/team.user';

export const getAllTeams = (context?: GetServerSidePropsContext): Promise<Team[]> => {
	return fetchData(`/teams`, { context, serverSide: !!context });
};

export const getTeamsOfUser = (context?: GetServerSidePropsContext): Promise<Team[]> => {
	return fetchData(`/teams/user`, { context, serverSide: !!context });
};

export const createTeamRequest = (newTeam: CreateTeamDto): Promise<Team> => {
	return fetchData(`/teams`, { method: 'POST', data: newTeam });
};

export const getTeamRequest = (id: string, context?: GetServerSidePropsContext): Promise<Team> => {
	return fetchData(`/teams/${id}`, { context, serverSide: !!context });
};

export const updateTeamUserRequest = (team: TeamUserUpdate): Promise<TeamUserUpdate> => {
	return fetchData(`/teams/${team.team}`, { method: 'PUT', data: team });
};
