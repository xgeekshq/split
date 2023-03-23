import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import { CreateTeamDto, Team } from './team';
import {
  TeamUserUpdate,
  TeamUserAddAndRemove,
  CreatedTeamUser,
  TeamUser,
  DeleteTeamUser,
} from './team.user';

export default interface UseTeamType {
  fetchTeams: UseQueryResult<Team[], unknown>;
  fetchTeam: UseQueryResult<Team, unknown>;
  fetchUserTeams: UseQueryResult<Team[], unknown>;
  fetchTeamsWithoutUser: UseQueryResult<Team[], unknown>;

  createTeam: UseMutationResult<Team, unknown, CreateTeamDto, unknown>;
  updateTeamUser: UseMutationResult<TeamUser, unknown, TeamUserUpdate, unknown>;
  addAndRemoveTeamUser: UseMutationResult<
    CreatedTeamUser[],
    unknown,
    TeamUserAddAndRemove,
    unknown
  >;
  deleteTeam: UseMutationResult<Team, unknown, { id: string }, unknown>;

  deleteTeamUser: UseMutationResult<TeamUser, unknown, DeleteTeamUser, unknown>;

  updateAddTeamsToUser: UseMutationResult<TeamUserUpdate, unknown, TeamUserUpdate[], unknown>;
}
