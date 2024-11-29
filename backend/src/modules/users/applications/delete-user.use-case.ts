import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { GetTeamUserServiceInterface } from '../../teamUsers/interfaces/services/get.team.user.service.interface';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { DELETE_TEAM_USER_SERVICE, GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { DELETE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';

@Injectable()
export class DeleteUserUseCase implements UseCase<string, boolean> {
	constructor(
		@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface,
		@Inject(DELETE_TEAM_USER_SERVICE)
		private readonly deleteTeamUserService: DeleteTeamUserServiceInterface,
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface,
		@Inject(DELETE_BOARD_USER_SERVICE)
		private readonly deleteBoardUserService: DeleteBoardUserServiceInterface
	) {}

	async execute(userId: string) {
		await this.userRepository.startTransaction();
		await this.deleteTeamUserService.startTransaction();
		await this.deleteBoardUserService.startTransaction();

		try {
			//User only get's deleted from board's that are not submitted, they must stay in the other's for historic purposes
			await this.deleteUserFromOpenBoards(userId);
			await this.deleteUserAndTeamUsers(userId);
			await this.deleteUser(userId, true);

			await this.userRepository.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();
			await this.deleteBoardUserService.commitTransaction();

			return true;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			await this.userRepository.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
			await this.deleteBoardUserService.abortTransaction();
		} finally {
			await this.userRepository.endSession();
			await this.deleteTeamUserService.endSession();
			await this.deleteBoardUserService.endSession();
		}
		throw new DeleteFailedException();
	}

	private async deleteUserAndTeamUsers(userId: string) {
		try {
			const teamsOfUser = await this.getTeamUserService.countTeamsOfUser(userId);

			if (teamsOfUser > 0) {
				await this.deleteTeamUserService.deleteTeamUsersOfUser(userId, true);
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new DeleteFailedException();
		}
	}

	private async deleteUser(userId: string, withSession: boolean) {
		const result = await this.userRepository.deleteUser(userId, withSession);

		if (!result) throw new DeleteFailedException();
	}

	private async deleteUserFromOpenBoards(userId: string) {
		try {
			await this.deleteBoardUserService.deleteBoardUserFromOpenBoards(userId);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			throw new DeleteFailedException();
		}
	}
}
