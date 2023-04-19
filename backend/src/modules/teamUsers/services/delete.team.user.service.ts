import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import { TEAM_USER_REPOSITORY } from '../constants';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';

@Injectable()
export default class DeleteTeamUserService implements DeleteTeamUserServiceInterface {
	constructor(
		@Inject(TEAM_USER_REPOSITORY)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async deleteTeamUsersOfUser(userId: string, withSession: boolean): Promise<number> {
		const { acknowledged, deletedCount } = await this.teamUserRepository.deleteTeamUsersOfUser(
			userId,
			withSession
		);

		if (!acknowledged) throw new BadRequestException(DELETE_FAILED);

		return deletedCount;
	}

	async deleteTeamUsers(teamUsers: string[], withSession: boolean): Promise<number> {
		const { acknowledged, deletedCount } = await this.teamUserRepository.deleteTeamUsers(
			teamUsers,
			withSession
		);

		if (!acknowledged) throw new BadRequestException(DELETE_FAILED);

		return deletedCount;
	}

	async deleteTeamUsersOfTeam(teamId: string, withSession: boolean): Promise<boolean> {
		const { acknowledged } = await this.teamUserRepository.deleteTeamUsersOfTeam(
			teamId,
			withSession
		);

		if (!acknowledged) throw new BadRequestException(DELETE_FAILED);

		return acknowledged;
	}

	// these functions are not tested since they make direct queries to the database
	startTransaction(): Promise<void> {
		return this.teamUserRepository.startTransaction();
	}
	commitTransaction(): Promise<void> {
		return this.teamUserRepository.commitTransaction();
	}
	abortTransaction(): Promise<void> {
		return this.teamUserRepository.abortTransaction();
	}
	endSession(): Promise<void> {
		return this.teamUserRepository.endSession();
	}
}
