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
  createTeam: UseMutationResult<Team, unknown, CreateTeamDto, unknown>;
  fetchAllTeams: UseQueryResult<Team[] | null, unknown>;
  fetchUserBasedTeams: UseQueryResult<Team[] | null, unknown>;
  fetchTeamsOfUser: UseQueryResult<Team[] | null, unknown>;
  fetchTeam: UseQueryResult<Team | null | undefined, unknown>;
  updateTeamUser: UseMutationResult<TeamUser, unknown, TeamUserUpdate, unknown>;
  addAndRemoveTeamUser: UseMutationResult<
    CreatedTeamUser[],
    unknown,
    TeamUserAddAndRemove,
    unknown
  >;
  deleteTeam: UseMutationResult<Team, unknown, { id: string }, unknown>;

  deleteTeamUser: UseMutationResult<TeamUser, unknown, DeleteTeamUser, unknown>;

  fetchTeamsOfSpecificUser: UseQueryResult<Team[], unknown>;

  fetchTeamsUserIsNotMember: UseQueryResult<Team[], unknown>;

  updateAddTeamsToUser: UseMutationResult<TeamUserUpdate, unknown, TeamUserUpdate[], unknown>;
}
