import { DeleteUserUseCaseInterface } from '../interfaces/applications/delete-user.use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import * as TeamUser from 'src/modules/teamUsers/interfaces/types';
import { GetTeamUserServiceInterface } from '../../teamUsers/interfaces/services/get.team.user.service.interface';
import UserDto from '../dto/user.dto';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';

@Injectable()
export class DeleteUserUseCase implements DeleteUserUseCaseInterface {
	constructor(
		@Inject(TYPES.repository) private readonly userRepository: UserRepositoryInterface,
		@Inject(TeamUser.TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface,
		@Inject(TeamUser.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface
	) {}

	async execute(user: UserDto, userId: string) {
		if (user._id == userId) {
			throw new DeleteFailedException();
		}

		await this.userRepository.startTransaction();
		await this.deleteTeamUserService.startTransaction();

		try {
			await this.deleteUser(userId, true);
			const teamsOfUser = await this.getTeamUserService.countTeamsOfUser(userId);

			if (teamsOfUser > 0) {
				await this.deleteTeamUserService.deleteTeamUsersOfUser(userId, false);
			}
			await this.userRepository.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();

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

	private async deleteUser(userId: string, withSession: boolean) {
		const result = await this.userRepository.deleteUser(userId, withSession);

		if (!result) throw new DeleteFailedException();
	}
}
