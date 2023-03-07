import { VotesBoardUserRepositoryInterface } from './../repositories/board-user.repository.interface';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { BOARD_NOT_FOUND, INSERT_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import BoardUser, { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { TYPES } from '../interfaces/types';
import { VotesBoardRepositoryInterface } from '../repositories/board.repository.interface';

@Injectable()
export default class CreateVoteServiceImpl implements CreateVoteServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		// @Inject(TYPES.repositories.VotesBoardRepository)
		// private readonly boardRepository: VotesBoardRepositoryInterface,
		// @Inject(TYPES.repositories.VotesBoardUserRepository)
		// private readonly boardUserRepository: VotesBoardUserRepositoryInterface,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}
	private logger: Logger = new Logger('CreateVoteService');

	private async canUserVote(
		boardId: string,
		userId: string,
		count: number,
		boardSession: ClientSession,
		boardUserSession: ClientSession
	): Promise<boolean> {
		const board = await this.boardModel.findById(boardId).session(boardSession).exec();

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		if (board.maxVotes === null || board.maxVotes === undefined) {
			return true;
		}
		const maxVotes = Number(board.maxVotes);

		console.log(
			'before',
			await this.boardUserModel
				.findOne({ board: boardId, user: userId })
				.session(boardUserSession)
				.exec()
		);

		const boardUserFound = await this.boardUserModel
			.findOne({ board: boardId, user: userId })
			.session(boardUserSession)
			.exec();
		console.log('after', boardUserFound);

		const userCanVote = boardUserFound?.votesCount !== undefined && boardUserFound?.votesCount >= 0;

		return userCanVote ? boardUserFound.votesCount + count <= maxVotes : false;
	}

	private async incrementVoteUser(
		boardId: string,
		userId: string,
		count: number,
		session?: ClientSession
	) {
		// console.log(
		// 	'after2',
		// 	await this.boardUserRepository.findOneByFieldAndUpdate(
		// 		{
		// 			user: userId,
		// 			board: boardId
		// 		},
		// 		{
		// 			$inc: { votesCount: count }
		// 		}
		// 	)
		// );
		const boardUser = await this.boardUserModel
			.updateOne(
				{
					user: userId,
					board: boardId
				},
				{
					$inc: { votesCount: count }
				},
				{
					session
				}
			)
			.lean()
			.exec();

		console.log('before2', boardUser);

		if (boardUser.modifiedCount !== 1) throw new BadRequestException(UPDATE_FAILED);
	}

	async addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		let retryCount = 0;
		const userSession = await this.boardUserModel.db.startSession();
		userSession.startTransaction();
		const session = await this.boardModel.db.startSession();
		session.startTransaction();

		const canUserVote = await this.canUserVote(boardId, userId, count, session, userSession);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		try {
			await this.incrementVoteUser(boardId, userId, count, userSession);
			const board = await this.boardModel
				.updateOne(
					{
						_id: boardId,
						'columns.cards.items._id': cardItemId
					},
					{
						$push: {
							'columns.$.cards.$[c].items.$[i].votes': Array(count).fill(userId)
						}
					},
					{
						arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
						session
					}
				)
				.lean()
				.exec();

			if (board.modifiedCount !== 1) throw new BadRequestException(INSERT_VOTE_FAILED);

			await userSession.commitTransaction();
			await session.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await userSession.abortTransaction();
			await session.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await userSession.endSession();
				await session.endSession();
				await this.addVoteToCard(boardId, cardId, userId, cardItemId, count);
			} else {
				throw new BadRequestException(INSERT_VOTE_FAILED);
			}
		} finally {
			await userSession.endSession();
			await session.endSession();
		}
	}

	async addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		let retryCount = 0;
		const userSession = await this.boardUserModel.db.startSession();
		userSession.startTransaction();
		const session = await this.boardModel.db.startSession();
		session.startTransaction();

		const canUserVote = await this.canUserVote(boardId, userId, count, session, userSession);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		try {
			await this.incrementVoteUser(boardId, userId, count, userSession);
			const board = await this.boardModel
				.updateOne(
					{
						_id: boardId,
						'columns.cards._id': cardId
					},
					{
						$push: {
							'columns.$.cards.$[c].votes': Array(count).fill(userId)
						}
					},
					{
						arrayFilters: [{ 'c._id': cardId }],
						session
					}
				)
				.lean()
				.exec();

			if (board.modifiedCount !== 1) throw new BadRequestException(INSERT_VOTE_FAILED);
			await session.commitTransaction();
			await userSession.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await session.abortTransaction();
			await userSession.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await userSession.endSession();
				await session.endSession();
				await this.addVoteToCardGroup(boardId, cardId, userId, count);
			} else {
				throw new BadRequestException(INSERT_VOTE_FAILED);
			}
		} finally {
			await userSession.endSession();
			await session.endSession();
		}
	}
}
