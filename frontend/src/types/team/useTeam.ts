import { UseMutationResult, UseQueryResult } from 'react-query';

import { CreateTeamDto, Team } from './team';

export default interface UseTeamType {
	createTeam: UseMutationResult<Team, unknown, CreateTeamDto, unknown>;
	fetchAllTeams: UseQueryResult<Team[] | null, unknown>;
	fetchTeamsOfUser: UseQueryResult<Team[] | null, unknown>;
}
