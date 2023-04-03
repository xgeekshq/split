import { DeleteBoardUserServiceInterface } from '../../boardUsers/interfaces/services/delete.board.user.service.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import Board from '../entities/board.schema';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { ArchiveChannelDataOptions } from 'src/modules/communication/dto/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';

@Injectable()
export default class DeleteBoardService implements DeleteBoardServiceInterface {
	constructor(
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.DeleteBoardUserService)
		private deleteBoardUserService: DeleteBoardUserServiceInterface,
		@Inject(Schedules.TYPES.services.DeleteSchedulesService)
		private deleteScheduleService: DeleteSchedulesServiceInterface,
		@Inject(CommunicationTypes.TYPES.services.SlackArchiveChannelService)
		private archiveChannelService: ArchiveChannelServiceInterface
	) {}

	async deleteBoardsByTeamId(teamId: string) {
		const teamBoards = await this.boardRepository.getAllBoardsByTeamId(teamId);
		const teamBoardsIds = teamBoards.map((board) => board._id);

		return this.deleteBoardBoardUsersAndSchedules(teamBoardsIds);
	}

	async deleteBoardBoardUsersAndSchedules(boardIdsToDelete: string[]) {
		await this.boardRepository.startTransaction();
		await this.deleteBoardUserService.startTransaction();
		await this.deleteScheduleService.startTransaction();
		const withSession = true;
		try {
			const boardsToDelete = await this.boardRepository.getBoardsByBoardIdsList(boardIdsToDelete);

			await this.deleteBoardBoardUsersAndSchedulesOperations(boardIdsToDelete, withSession);

			await this.boardRepository.commitTransaction();
			await this.deleteBoardUserService.commitTransaction();
			await this.deleteScheduleService.commitTransaction();

			this.archiveBoardsChannels(boardsToDelete);

			return true;
		} catch (error) {
			throw new BadRequestException(DELETE_FAILED);
		} finally {
			await this.boardRepository.endSession();
			await this.deleteBoardUserService.endSession();
			await this.deleteScheduleService.endSession();
		}
	}

	/* --------------- HELPERS --------------- */

	private async deleteBoardBoardUsersAndSchedulesOperations(
		boardIdsToDelete: string[],
		withSession: boolean
	) {
		try {
			const boardUsersDeleted = await this.deleteBoardUserService.deleteBoardUsersByBoardList(
				boardIdsToDelete,
				withSession
			);
			const schedulesDeleted = await this.deleteScheduleService.deleteSchedulesByBoardList(
				boardIdsToDelete,
				withSession
			);
			const boardsDeleted = await this.boardRepository.deleteBoardsByBoardList(
				boardIdsToDelete,
				withSession
			);

			if (
				!(
					boardUsersDeleted.acknowledged &&
					schedulesDeleted.acknowledged &&
					boardsDeleted.acknowledged
				)
			)
				throw new BadRequestException(DELETE_FAILED);
		} catch (e) {
			await this.boardRepository.abortTransaction();
			await this.deleteBoardUserService.abortTransaction();
			await this.deleteScheduleService.abortTransaction();
			throw new BadRequestException(DELETE_FAILED);
		}
	}

	private archiveBoardsChannels(boardsDeleted: Board[]) {
		boardsDeleted.forEach(async (board: Board) => {
			const { slackEnable } = board;

			// if slack is enable for the deleted board
			if (slackEnable) {
				// archive board channel
				this.archiveChannelService.execute({
					type: ArchiveChannelDataOptions.BOARD,
					data: {
						id: board._id,
						slackChannelId: board.slackChannelId
					}
				});
			}
		});
	}
}
