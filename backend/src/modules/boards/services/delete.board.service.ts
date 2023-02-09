import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, LeanDocument, Model, ObjectId } from 'mongoose';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import isEmpty from 'src/libs/utils/isEmpty';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import { TeamUserDocument } from 'src/modules/teams/entities/team.user.schema';
import { UserDocument } from 'src/modules/users/entities/user.schema';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import Board, { BoardDocument } from '../entities/board.schema';
import BoardUser, { BoardUserDocument } from '../entities/board.user.schema';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { ArchiveChannelDataOptions } from 'src/modules/communication/dto/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';

@Injectable()
export default class DeleteBoardServiceImpl implements DeleteBoardServiceInterface {
	constructor(
		@InjectModel(Board.name)
		private boardModel: Model<BoardDocument>,
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(Schedules.TYPES.services.DeleteSchedulesService)
		private deleteSheduleService: DeleteSchedulesServiceInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(forwardRef(() => Boards.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface,
		@Inject(CommunicationTypes.TYPES.services.SlackArchiveChannelService)
		private archiveChannelService: ArchiveChannelServiceInterface
	) {}

	private async getTeamUser(
		userId: string,
		teamId: string
	): Promise<LeanDocument<TeamUserDocument>> {
		const teamUser = await this.getTeamService.getTeamUser(userId, teamId);

		if (!teamUser) {
			throw new NotFoundException('User not found on this team!');
		}

		return teamUser;
	}

	private async isUserSAdmin(
		userId: string,
		teamUsers: LeanDocument<TeamUserDocument>[]
	): Promise<boolean> {
		const myUser = teamUsers.find(
			(user) => String((user.user as UserDocument)?._id) === String(userId)
		);
		const isUserSAdmin = (myUser?.user as UserDocument).isSAdmin;

		return isUserSAdmin;
	}

	private async getUsersOfTeam(teamId: string): Promise<LeanDocument<TeamUserDocument>[]> {
		const users = await this.getTeamService.getUsersOfTeam(teamId);

		if (!users) {
			throw new NotFoundException('User not found list of users!');
		}

		return users;
	}

	async deleteSubBoards(dividedBoards: Board[] | ObjectId[], boardSession: ClientSession) {
		const { deletedCount } = await this.boardModel
			.deleteMany({ _id: { $in: dividedBoards } }, { session: boardSession })
			.exec();

		if (deletedCount !== dividedBoards.length) throw Error(DELETE_FAILED);
	}

	async deleteBoardUsers(
		dividedBoards: Board[] | ObjectId[],
		boardSession: ClientSession,
		boardId: ObjectId
	) {
		const { deletedCount } = await this.boardUserModel
			.deleteMany({ board: { $in: [...dividedBoards, boardId] } }, { session: boardSession })
			.exec();

		if (deletedCount <= 0) throw Error(DELETE_FAILED);
	}

	async deleteBoard(boardId: string, boardSession: ClientSession) {
		const result = await this.boardModel.findOneAndRemove(
			{
				_id: boardId
			},
			{ session: boardSession }
		);

		if (!result) throw Error(DELETE_FAILED);

		return {
			dividedBoards: result.dividedBoards,
			_id: result._id,
			slackEnable: result.slackEnable
		};
	}

	async delete(boardId: string) {
		const board = await this.boardRepository.getBoard(boardId);

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
		const boardSession = await this.boardModel.db.startSession();
		const boardUserSession = await this.boardUserModel.db.startSession();
		boardSession.startTransaction();
		boardUserSession.startTransaction();
		try {
			const { _id, dividedBoards, slackEnable } = await this.deleteBoard(
				boardId.toString(),
				boardSession
			);
			this.deleteSheduleService.findAndDeleteScheduleByBoardId(boardId);

			if (isMainBoard && !isEmpty(dividedBoards)) {
				await this.deleteSubBoards(dividedBoards, boardSession);

				await this.deleteBoardUsers(dividedBoards, boardUserSession, _id);
			} else {
				await this.deleteSimpleBoardUsers(boardUserSession, _id);
			}

			// if slack is enable for the deleted board
			if (slackEnable) {
				// archive all related channels
				// for that we need to fecth the board with all dividedBoards
				const board = await this.getBoardService.getBoardFromRepo(boardId);

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

			await boardSession.commitTransaction();
			await boardUserSession.commitTransaction();

			return true;
		} catch (e) {
			await boardSession.abortTransaction();
			await boardUserSession.abortTransaction();
		} finally {
			await boardSession.endSession();
			await boardUserSession.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteSimpleBoardUsers(boardSession: ClientSession, boardId: string) {
		const { deletedCount } = await this.boardUserModel
			.deleteMany(
				{
					board: boardId
				},
				{ session: boardSession }
			)
			.exec();

		if (deletedCount <= 0) throw Error(DELETE_FAILED);
	}
}
