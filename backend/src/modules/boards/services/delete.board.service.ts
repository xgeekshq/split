import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import isEmpty from 'src/libs/utils/isEmpty';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import Board, { BoardDocument } from '../entities/board.schema';
import BoardUser, { BoardUserDocument } from '../entities/board.user.schema';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { ArchiveChannelDataOptions } from 'src/modules/communication/dto/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BoardUserRepositoryInterface } from '../repositories/board-user.repository.interface';
import { BoardDataPopulate } from '../utils/populate-board';

@Injectable()
export default class DeleteBoardServiceImpl implements DeleteBoardServiceInterface {
	constructor(
		@InjectModel(Board.name)
		private boardModel: Model<BoardDocument>,
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(Boards.TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface,
		@Inject(Schedules.TYPES.services.DeleteSchedulesService)
		private deleteSheduleService: DeleteSchedulesServiceInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(forwardRef(() => Boards.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface,
		@Inject(CommunicationTypes.TYPES.services.SlackArchiveChannelService)
		private archiveChannelService: ArchiveChannelServiceInterface
	) {}

	async deleteSubBoards(dividedBoards: Board[] | ObjectId[] | string[], boardSession: boolean) {
		const deletedCount = await this.boardRepository.deleteManySubBoards(
			dividedBoards,
			boardSession
		);

		if (deletedCount !== dividedBoards.length) throw Error(DELETE_FAILED);
	}

	async deleteBoardUsers(
		dividedBoards: Board[] | ObjectId[] | string[],
		boardSession: boolean,
		boardId: ObjectId | string
	) {
		const deletedCount = await this.boardUserRepository.deleteDividedBoardUsers(
			dividedBoards,
			boardSession,
			boardId
		);

		if (deletedCount <= 0) throw Error(DELETE_FAILED);
	}

	async deleteBoard(boardId: string, boardSession: boolean) {
		const result = await this.boardRepository.deleteBoard(boardId, boardSession);

		if (!result) throw Error(DELETE_FAILED);

		return {
			dividedBoards: result.dividedBoards,
			_id: result._id,
			slackEnable: result.slackEnable
		};
	}

	async delete(boardId: string) {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		try {
			return await this.deleteBoardBoardUsersAndSchedules(boardId, true);
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

	private async deleteBoardBoardUsersAndSchedules(boardId: string, isMainBoard: boolean) {
		await this.boardRepository.startTransaction();
		await this.boardUserRepository.startTransaction();
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
			await this.boardUserRepository.commitTransaction();

			return true;
		} catch (e) {
			await this.boardRepository.abortTransaction();
			await this.boardUserRepository.abortTransaction();
		} finally {
			await this.boardRepository.endSession();
			await this.boardUserRepository.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteSimpleBoardUsers(boardSession: boolean, boardId: string) {
		const deletedCount = await this.boardUserRepository.deleteSimpleBoardUsers(
			boardId,
			boardSession
		);

		if (deletedCount <= 0) throw Error(DELETE_FAILED);
	}
}
