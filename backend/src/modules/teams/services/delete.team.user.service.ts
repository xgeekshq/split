import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import { TYPES } from '../interfaces/types';
import { TeamUserRepositoryInterface } from '../repositories/team-user.repository.interface';

@Injectable()
export default class DeleteTeamUserService implements DeleteTeamUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async delete(userId: string): Promise<boolean> {
		await this.teamUserRepository.startTransaction();

		try {
			await this.deleteTeamUsers(userId, true);
			await this.teamUserRepository.commitTransaction();

			return true;
		} catch (e) {
			await this.teamUserRepository.abortTransaction();
		} finally {
			await this.teamUserRepository.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteTeamUsers(userId: string, withSession: boolean) {
		const deletedCount = await this.teamUserRepository.deleteManyTeamUser(userId, withSession);

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}

	async deleteTeamUser(teamUserId: string, withSession: boolean) {
		const deletedCount = await this.teamUserRepository.deleteTeamOfUserOnly(
			teamUserId,
			withSession
		);

		if (!deletedCount) throw new Error(DELETE_FAILED);

		return deletedCount;
	}
}
