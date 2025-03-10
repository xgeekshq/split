import { DeleteBoardUserServiceInterface } from '../../boardUsers/interfaces/services/delete.board.user.service.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import Board from '../entities/board.schema';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { ArchiveChannelDataOptions } from 'src/modules/communication/dto/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';
import { DELETE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';
import { DELETE_SCHEDULES_SERVICE } from 'src/modules/schedules/constants';
import { SLACK_ARCHIVE_CHANNEL_SERVICE } from 'src/modules/communication/constants';

@Injectable()
export default class DeleteBoardService implements DeleteBoardServiceInterface {
	constructor(
		@Inject(BOARD_REPOSITORY)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(DELETE_BOARD_USER_SERVICE)
		private readonly deleteBoardUserService: DeleteBoardUserServiceInterface,
		@Inject(DELETE_SCHEDULES_SERVICE)
		private readonly deleteScheduleService: DeleteSchedulesServiceInterface,
		@Inject(SLACK_ARCHIVE_CHANNEL_SERVICE)
		private readonly archiveChannelService: ArchiveChannelServiceInterface
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

			await this.deleteBoardAndBoardUsersAndSchedulesOperations(boardIdsToDelete, withSession);

			await this.boardRepository.commitTransaction();
			await this.deleteBoardUserService.commitTransaction();
			await this.deleteScheduleService.commitTransaction();

			this.archiveBoardsChannels(boardsToDelete);

			return true;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new BadRequestException(DELETE_FAILED);
		} finally {
			await this.boardRepository.endSession();
			await this.deleteBoardUserService.endSession();
			await this.deleteScheduleService.endSession();
		}
	}

	/* --------------- HELPERS --------------- */

	private async deleteBoardAndBoardUsersAndSchedulesOperations(
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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
