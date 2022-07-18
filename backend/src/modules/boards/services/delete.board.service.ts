import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, ObjectId } from 'mongoose';

import { DELETE_FAILED } from 'libs/exceptions/messages';
import isEmpty from 'libs/utils/isEmpty';

import { DeleteBoardService } from '../interfaces/services/delete.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class DeleteBoardServiceImpl implements DeleteBoardService {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}

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
		const boardUserSession = await this.boardUserModel.db.startSession();
		boardSession.startTransaction();
		boardUserSession.startTransaction();

		try {
			const { _id, dividedBoards } = await this.deleteBoard(boardId, userId, boardSession);

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

		return false;
	}
}
