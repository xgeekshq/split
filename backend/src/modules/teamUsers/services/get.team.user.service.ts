import { GetTeamUserServiceInterface } from '../interfaces/services/get.team.user.service.interface';
import { TYPES } from '../interfaces/types';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import User from 'src/modules/users/entities/user.schema';
import TeamUser from '../entities/team.user.schema';
import { UserWithTeams } from 'src/modules/users/interfaces/type-user-with-teams';

@Injectable()
export default class GetTeamUserService implements GetTeamUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	// these functions are not tested since they make direct queries to the database
	countTeamsOfUser(userId: string): Promise<number> {
		return this.teamUserRepository.countTeamsOfUser(userId);
	}

	getAllTeamsOfUser(userId: string): Promise<TeamUser[]> {
		return this.teamUserRepository.getAllTeamsOfUser(userId);
	}

	getUsersOnlyWithTeams(users: User[]): Promise<UserWithTeams[]> {
		return this.teamUserRepository.getUsersOnlyWithTeams(users);
	}

	getTeamUser(userId: string, teamId: string): Promise<TeamUser> {
		return this.teamUserRepository.getTeamUser(userId, teamId);
	}

	getUsersOfTeam(teamId: string): Promise<TeamUser[]> {
		return this.teamUserRepository.getUsersOfTeam(teamId);
	}
}
