import { UseMutationResult, UseQueryResult } from 'react-query';

import { CreateTeamDto, Team } from './team';
import { TeamUserUpdate, TeamUserAddAndRemove } from './team.user';

export default interface UseTeamType {
  createTeam: UseMutationResult<Team, unknown, CreateTeamDto, unknown>;
  fetchAllTeams: UseQueryResult<Team[] | null, unknown>;
  fetchTeamsOfUser: UseQueryResult<Team[] | null, unknown>;
  fetchTeam: UseQueryResult<Team | null | undefined, unknown>;
  updateTeamUser: UseMutationResult<TeamUserUpdate, unknown, TeamUserUpdate, unknown>;
  addAndRemoveTeamUser: UseMutationResult<Team, unknown, TeamUserAddAndRemove, unknown>;
  deleteTeam: UseMutationResult<Team, unknown, { id: string }, unknown>;
}
