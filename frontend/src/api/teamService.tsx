import { GetServerSidePropsContext } from 'next';

import { CreateTeamDto, Team } from 'types/team/team';
import fetchData from 'utils/fetchData';

export const getAllTeams = (context?: GetServerSidePropsContext): Promise<Team[]> => {
	return fetchData(`/teams`, { context, serverSide: !!context });
};

export const getTeamsOfUser = (context?: GetServerSidePropsContext): Promise<Team[]> => {
	return fetchData(`/teams/user`, { context, serverSide: !!context });
};

export const createTeamRequest = (newTeam: CreateTeamDto): Promise<Team> => {
	return fetchData(`/teams`, { method: 'POST', data: newTeam });
};
