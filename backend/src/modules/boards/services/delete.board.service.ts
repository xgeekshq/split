import { DeleteBoardUserServiceInterface } from './../../boardusers/interfaces/services/delete.board.user.service.interface';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import isEmpty from 'src/libs/utils/isEmpty';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import Board from '../entities/board.schema';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardusers/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { ArchiveChannelDataOptions } from 'src/modules/communication/dto/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BoardDataPopulate } from '../utils/populate-board';

@Injectable()
export default class DeleteBoardServiceImpl implements DeleteBoardServiceInterface {
	constructor(
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.DeleteBoardUserService)
		private deleteBoardUserService: DeleteBoardUserServiceInterface,
		@Inject(Schedules.TYPES.services.DeleteSchedulesService)
		private deleteSheduleService: DeleteSchedulesServiceInterface,
		@Inject(forwardRef(() => Boards.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface,
		@Inject(CommunicationTypes.TYPES.services.SlackArchiveChannelService)
		private archiveChannelService: ArchiveChannelServiceInterface
	) {}

	async delete(boardId: string) {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		try {
			return this.deleteBoardBoardUsersAndSchedules(boardId, true);
		} catch (error) {
			throw new BadRequestException(DELETE_FAILED);
		}
	}

	async deleteBoardsByTeamId(teamId: string) {
		const teamBoards = await this.getBoardService.getAllBoardsByTeamId(teamId);

		const promises = teamBoards.map((board) =>
			this.deleteBoardBoardUsersAndSchedules(board._id.toString(), false)
		);

		await Promise.all(promises).catch(() => {
			throw new BadRequestException(DELETE_FAILED);
		});

		return true;
	}

	/* --------------- HELPERS --------------- */

	private async deleteSubBoards(
		dividedBoards: Board[] | ObjectId[] | string[],
		boardSession: boolean
	) {
		const deletedCount = await this.boardRepository.deleteManySubBoards(
			dividedBoards,
			boardSession
		);

		if (deletedCount !== dividedBoards.length) throw Error(DELETE_FAILED);
	}

	private async deleteBoardUsers(
		dividedBoards: Board[] | ObjectId[] | string[],
		boardSession: boolean,
		boardId: ObjectId | string
	) {
		const deletedCount = await this.deleteBoardUserService.deleteDividedBoardUsers(
			dividedBoards,
			boardSession,
			boardId
		);

		if (deletedCount <= 0) throw Error(DELETE_FAILED);
	}

	private async deleteBoard(boardId: string, boardSession: boolean) {
		const result = await this.boardRepository.deleteBoard(boardId, boardSession);

		if (!result) throw Error(DELETE_FAILED);

		return {
			dividedBoards: result.dividedBoards,
			_id: result._id,
			slackEnable: result.slackEnable
		};
	}

	private async deleteBoardBoardUsersAndSchedules(boardId: string, isMainBoard: boolean) {
		await this.boardRepository.startTransaction();
		await this.deleteBoardUserService.startTransaction();
		try {
			const { _id, dividedBoards, slackEnable } = await this.deleteBoard(boardId.toString(), true);
			this.deleteSheduleService.findAndDeleteScheduleByBoardId(boardId);

			if (isMainBoard && !isEmpty(dividedBoards)) {
				await this.deleteSubBoards(dividedBoards, true);

				await this.deleteBoardUsers(dividedBoards, true, _id);
			} else {
				await this.deleteSimpleBoardUsers(true, _id);
			}

			// if slack is enable for the deleted board
			if (slackEnable) {
				// archive all related channels
				// for that we need to fetch the board with all dividedBoards

				const board = await this.getBoardService.getBoardPopulated(boardId, BoardDataPopulate);

				this.archiveChannelService.execute({
					type: ArchiveChannelDataOptions.BOARD,
					data: {
						id: board._id,
						slackChannelId: board.slackChannelId,
						dividedBoards: board.dividedBoards.map((i) => ({
							id: i._id,
							slackChannelId: i.slackChannelId
						}))
					},
					cascade: true
				});
			}

			await this.boardRepository.commitTransaction();
			await this.deleteBoardUserService.commitTransaction();

			return true;
		} catch (e) {
			await this.boardRepository.abortTransaction();
			await this.deleteBoardUserService.abortTransaction();
		} finally {
			await this.boardRepository.endSession();
			await this.deleteBoardUserService.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteSimpleBoardUsers(boardSession: boolean, boardId: string) {
		const deletedCount = await this.deleteBoardUserService.deleteSimpleBoardUsers(
			boardId,
			boardSession
		);

		if (deletedCount <= 0) throw Error(DELETE_FAILED);
	}
}
