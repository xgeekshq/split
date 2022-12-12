import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteTeamServiceInterface } from '../interfaces/services/delete.team.service.interface';
import { TYPES } from '../interfaces/types';
import { TeamRepositoryInterface } from '../repositories/team.repository.interface';
import { TeamUserRepositoryInterface } from '../repositories/team-user.repository.interface';
import * as Boards from '../../boards/interfaces/types';
import { DeleteBoardServiceInterface } from 'src/modules/boards/interfaces/services/delete.board.service.interface';

@Injectable()
export default class DeleteTeamService implements DeleteTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamRepository)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface,
		@Inject(Boards.TYPES.services.DeleteBoardService)
		private deleteBoardService: DeleteBoardServiceInterface
	) {}

	async delete(teamId: string): Promise<boolean> {
		await this.teamRepository.startTransaction();
		await this.teamUserRepository.startTransaction();

		try {
			await this.deleteTeam(teamId, true);
			await this.deleteTeamUsers(teamId, true);

			await this.deleteBoardService.deleteBoardsByTeamId(teamId);

			await this.teamRepository.commitTransaction();
			await this.teamUserRepository.commitTransaction();

			return true;
		} catch (e) {
			await this.teamRepository.abortTransaction();
			await this.teamUserRepository.abortTransaction();
		} finally {
			await this.teamRepository.endSession();
			await this.teamUserRepository.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteTeam(teamId: string, withSession: boolean) {
		const result = await this.teamRepository.findOneAndRemoveByField(
			{
				_id: teamId
			},
			withSession
		);

		if (!result) throw new NotFoundException(DELETE_FAILED);
	}

	private async deleteTeamUsers(teamId: string, withSession: boolean) {
		const deletedCount = await this.teamUserRepository.deleteMany(
			{
				team: teamId
			},
			withSession
		);

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}
}
