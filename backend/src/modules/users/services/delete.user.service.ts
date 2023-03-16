import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteUserServiceInterface } from '../interfaces/services/delete.user.service.interface';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import UserDto from '../dto/user.dto';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import * as TeamUser from 'src/modules/teamusers/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamusers/interfaces/services/delete.team.user.service.interface';

@Injectable()
export default class DeleteUserService implements DeleteUserServiceInterface {
	constructor(
		@Inject(TYPES.repository) private readonly userRepository: UserRepositoryInterface,
		@Inject(TeamUser.TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface,
		@Inject(TeamUser.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamServiceInterface
	) {}

	async delete(user: UserDto, userId: string): Promise<boolean> {
		if (user._id == userId) {
			throw new BadRequestException(DELETE_FAILED);
		}

		await this.userRepository.startTransaction();
		await this.deleteTeamUserService.startTransaction();

		try {
			this.deleteUser(userId, true);
			const teamsOfUser = await this.getTeamUserService.getTeamsOfUser(userId);

			if (teamsOfUser.length > 0) {
				// here
				await this.deleteTeamUserService.deleteTeamUsersOfUser(userId, false);
			}
			await this.userRepository.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();

			await this.userRepository.endSession();
			await this.deleteTeamUserService.endSession();

			return true;
		} catch (e) {
			await this.userRepository.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
		} finally {
			await this.userRepository.endSession();
			await this.deleteTeamUserService.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteUser(userId: string, withSession: boolean) {
		const result = await this.userRepository.deleteUser(userId, withSession);

		if (!result) throw new NotFoundException(DELETE_FAILED);
	}
}
