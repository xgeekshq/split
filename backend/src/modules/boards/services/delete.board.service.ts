import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, LeanDocument, Model, ObjectId } from 'mongoose';

import { TeamRoles } from 'libs/enum/team.roles';
import { DELETE_FAILED } from 'libs/exceptions/messages';
import isEmpty from 'libs/utils/isEmpty';
import { GetTeamServiceInterface } from 'modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'modules/teams/interfaces/types';
import * as Schedules from 'modules/schedules/interfaces/types'
import { TeamUserDocument } from 'modules/teams/schemas/team.user.schema';
import { UserDocument } from 'modules/users/schemas/user.schema';

import { DeleteBoardService } from '../interfaces/services/delete.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';
import { DeleteSchedulesServiceInterface } from 'modules/schedules/interfaces/services/delete.schedules.service';

@Injectable()
export default class DeleteBoardServiceImpl implements DeleteBoardService {
	constructor(
		@InjectModel(Board.name)
		private boardModel: Model<BoardDocument>,
		@Inject(Teams.TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface,
		@Inject(Schedules.TYPES.services.DeleteSchedulesService)
		private deleteSheduleService: DeleteSchedulesServiceInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
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

	async deleteBoard(boardId: string, userId: string, boardSession: ClientSession) {
		const result = await this.boardModel.findOneAndRemove(
			{
				_id: boardId
			},
			{ session: boardSession }
		);

		if (!result) throw Error(DELETE_FAILED);
		return { dividedBoards: result.dividedBoards, _id: result._id };
	}

	async delete(boardId: string, userId: string) {
		const boardSession = await this.boardModel.db.startSession();
		const board = await this.boardModel.findById(boardId).exec();
		if (!board) {
			throw new NotFoundException('Board not found!');
		}
		const { team, createdBy } = board;
		const teamUser = await this.getTeamUser(userId, String(team));
		const users = await this.getUsersOfTeam(String(team));

		const userIsSAdmin = await this.isUserSAdmin(userId, users);

		const isAdminOrStakeholder = [TeamRoles.STAKEHOLDER, TeamRoles.ADMIN].includes(
			teamUser.role as TeamRoles
		);

		// Validate if the logged user are the owner
		const isOwner = String(userId) === String(createdBy);

		if (isOwner || isAdminOrStakeholder || userIsSAdmin) {
			const boardUserSession = await this.boardUserModel.db.startSession();
			boardSession.startTransaction();
			boardUserSession.startTransaction();
			try {
				const { _id, dividedBoards } = await this.deleteBoard(boardId, userId, boardSession);
				this.deleteSheduleService.findAndDeleteScheduleByBoardId(boardId)

				if (!isEmpty(dividedBoards)) {
					await this.deleteSubBoards(dividedBoards, boardSession);

					await this.deleteBoardUsers(dividedBoards, boardUserSession, _id);
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
		}

		return false;
	}
}
