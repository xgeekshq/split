import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteUserServiceInterface } from '../interfaces/services/delete.user.service.interface';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import UserDto from '../dto/user.dto';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import * as TeamUser from 'src/modules/teams/interfaces/types';
import { DeleteTeamUserServiceInterface } from 'src/modules/teams/interfaces/services/delete.team.user.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';

@Injectable()
export default class DeleteUserService implements DeleteUserServiceInterface {
	constructor(
		@Inject(TYPES.repository) private readonly userRepository: UserRepositoryInterface,
		@Inject(TeamUser.TYPES.services.DeleteTeamUserService)
		private teamUserService: DeleteTeamUserServiceInterface,
		@Inject(TeamUser.TYPES.services.GetTeamService)
		private getTeamUserService: GetTeamServiceInterface
	) {}

	async delete(user: UserDto, userId: string): Promise<boolean> {
		if (user._id == userId) {
			throw new BadRequestException(DELETE_FAILED);
		}

		await this.userRepository.startTransaction();

		try {
			this.deleteUser(userId, true);
			const teamsOfUser = await this.getTeamUserService.getTeamsOfUser(userId);

			if (teamsOfUser.length > 0) {
				await this.teamUserService.delete(userId);
			}
			await this.userRepository.commitTransaction();

			return true;
		} catch (e) {
			await this.userRepository.abortTransaction();
		} finally {
			await this.userRepository.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteUser(userId: string, withSession: boolean) {
		const result = await this.userRepository.deleteUser(userId, withSession);

		if (!result) throw new NotFoundException(DELETE_FAILED);
	}
}
