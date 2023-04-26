import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../constants';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { GetTeamUserServiceInterface } from '../../teamUsers/interfaces/services/get.team.user.service.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { DELETE_TEAM_USER_SERVICE, GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

@Injectable()
export class DeleteUserUseCase implements UseCase<string, boolean> {
	constructor(
		@Inject(TYPES.repository) private readonly userRepository: UserRepositoryInterface,
		@Inject(DELETE_TEAM_USER_SERVICE)
		private readonly deleteTeamUserService: DeleteTeamUserServiceInterface,
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface
	) {}

	async execute(userId: string) {
		await this.userRepository.startTransaction();
		await this.deleteTeamUserService.startTransaction();

		try {
			await this.deleteUserAndTeamUsers(userId);

			return true;
		} catch (e) {
			await this.userRepository.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
		} finally {
			await this.userRepository.endSession();
			await this.deleteTeamUserService.endSession();
		}
		throw new DeleteFailedException();
	}

	private async deleteUserAndTeamUsers(userId: string) {
		try {
			await this.deleteUser(userId, true);
			const teamsOfUser = await this.getTeamUserService.countTeamsOfUser(userId);

			if (teamsOfUser > 0) {
				await this.deleteTeamUserService.deleteTeamUsersOfUser(userId, true);
			}
			await this.userRepository.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();
		} catch (error) {
			throw new DeleteFailedException();
		}
	}

	private async deleteUser(userId: string, withSession: boolean) {
		const result = await this.userRepository.deleteUser(userId, withSession);

		if (!result) throw new DeleteFailedException();
	}
}
