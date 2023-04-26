import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { DeleteBoardServiceInterface } from 'src/modules/boards/interfaces/services/delete.board.service.interface';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';
import { DELETE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { DELETE_BOARD_SERVICE } from 'src/modules/boards/constants';
import { TEAM_REPOSITORY } from '../constants';

@Injectable()
export class DeleteTeamUseCase implements UseCase<string, boolean> {
	constructor(
		@Inject(TEAM_REPOSITORY)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(DELETE_BOARD_SERVICE)
		private readonly deleteBoardService: DeleteBoardServiceInterface,
		@Inject(DELETE_TEAM_USER_SERVICE)
		private readonly deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}

	async execute(teamId: string): Promise<boolean> {
		await this.teamRepository.startTransaction();
		await this.deleteTeamUserService.startTransaction();

		try {
			await this.deleteTeamAndTeamUsersAndBoards(teamId);

			await this.teamRepository.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();

			return true;
		} catch (error) {
			throw new BadRequestException(DELETE_FAILED);
		} finally {
			await this.teamRepository.endSession();
			await this.deleteTeamUserService.endSession();
		}
	}

	/* --------------- HELPERS --------------- */

	private async deleteTeamAndTeamUsersAndBoards(teamId: string) {
		try {
			await this.deleteTeam(teamId, true);
			await this.deleteTeamUserService.deleteTeamUsersOfTeam(teamId, true);
			await this.deleteBoardService.deleteBoardsByTeamId(teamId);
		} catch (e) {
			await this.teamRepository.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
			throw new BadRequestException(DELETE_FAILED);
		}
	}

	private async deleteTeam(teamId: string, withSession: boolean) {
		const result = await this.teamRepository.findOneAndRemoveByField(
			{
				_id: teamId
			},
			withSession
		);

		if (!result) throw new BadRequestException(DELETE_FAILED);
	}
}
