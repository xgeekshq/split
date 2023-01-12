import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';
import { ClientSession, Model } from 'mongoose';
import { DELETE_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { arrayIdToString } from 'src/libs/utils/arrayIdToString';
import isEmpty from 'src/libs/utils/isEmpty';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import BoardUser, { BoardUserDocument } from 'src/modules/boards/schemas/board.user.schema';
import { GetCardService } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import { TYPES } from 'src/modules/cards/interfaces/types';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';

@Injectable()
export default class DeleteVoteServiceImpl implements DeleteVoteServiceInterface {
	constructor(
		@InjectModel(Board.name)
		private boardModel: Model<BoardDocument>,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>,
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardService
	) {}

	private async canUserVote(
		boardId: string,
		userId: string,
		count: number,
		boardSession: ClientSession,
		boardUserSession: ClientSession
	): Promise<boolean> {
		const board = await this.boardModel.findById(boardId).session(boardSession).exec();

		if (!board) {
			throw new NotFoundException('Board not found!');
		}

		const boardUserFound = await this.boardUserModel
			.findOne({ board: boardId, user: userId })
			.session(boardUserSession)
			.exec();

		return boardUserFound?.votesCount
			? boardUserFound.votesCount > 0 && boardUserFound.votesCount - Math.abs(count) >= 0
			: false;
	}

	async decrementVoteUser(
		boardId: string,
		userId: string,
		count?: number,
		session?: ClientSession
	) {
		const boardUser = await this.boardUserModel.updateOne(
			{
				user: userId,
				board: boardId
			},
			{
				$inc: { votesCount: !count ? -1 : count }
			},
			{ session }
		);

		if (boardUser.modifiedCount !== 1) throw new BadRequestException(UPDATE_FAILED);
	}

	async deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		const userSession = await this.boardUserModel.db.startSession();
		userSession.startTransaction();
		const session = await this.boardModel.db.startSession();
		session.startTransaction();

		const canUserVote = await this.canUserVote(boardId, userId, count, session, userSession);

		if (!canUserVote) throw new BadRequestException(DELETE_VOTE_FAILED);
		const card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) throw new BadRequestException(DELETE_VOTE_FAILED);

		const cardItem = card.items.find((item) => item._id.toString() === cardItemId);

		if (!cardItem) throw new BadRequestException(DELETE_VOTE_FAILED);

		let votes = cardItem.votes as unknown as string[];

		const userVotes = votes.filter((vote) => vote.toString() === userId.toString());
		votes = votes.filter((vote) => vote.toString() !== userId.toString());
		userVotes.splice(0, Math.abs(count));
		votes = votes.concat(userVotes);

		try {
			await this.decrementVoteUser(boardId, userId, count, userSession);
			const board = await this.setCardItemVotes(boardId, cardItemId, votes, cardId, session);

			if (board.modifiedCount !== 1) throw new BadRequestException(DELETE_VOTE_FAILED);

			await userSession.commitTransaction();
			await session.commitTransaction();
		} catch (e) {
			await userSession.abortTransaction();
			await session.abortTransaction();
		} finally {
			await session.endSession();
			await userSession.endSession();
		}
	}

	async deleteVoteFromCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		const userSession = await this.boardUserModel.db.startSession();
		userSession.startTransaction();
		const session = await this.boardModel.db.startSession();
		session.startTransaction();
		const canUserVote = await this.canUserVote(boardId, userId, count, session, userSession);

		if (!canUserVote) throw new BadRequestException(DELETE_VOTE_FAILED);
		const currentCount = Math.abs(count);
		let card = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!card) throw new BadRequestException(DELETE_VOTE_FAILED);

		const { votes } = card;

		let mappedVotes = votes as unknown as string[];
		const userVotes = mappedVotes.filter((vote) => vote.toString() === userId.toString());

		if (!isEmpty(votes.length)) {
			const votesToReduce = userVotes.length / currentCount >= 1 ? currentCount : userVotes.length;
			mappedVotes = mappedVotes.filter((vote) => vote.toString() !== userId.toString());

			userVotes.splice(0, Math.abs(votesToReduce));

			mappedVotes = mappedVotes.concat(userVotes);

			try {
				await this.decrementVoteUser(boardId, userId, -votesToReduce, userSession);
				const board = await this.setCardVotes(boardId, mappedVotes, cardId, session);

				if (board.modifiedCount !== 1) throw new BadRequestException(DELETE_VOTE_FAILED);

				await userSession.commitTransaction();
				await session.commitTransaction();
			} catch (e) {
				await userSession.abortTransaction();
				await session.abortTransaction();
			} finally {
				await session.endSession();
				await userSession.endSession();
			}

			// currentCount -= Math.abs(votesToReduce);

			// if (currentCount === 0) return;

			return;
		}

		if (!isEmpty(currentCount)) {
			// while (currentCount > 0) {
			card = await this.getCardService.getCardFromBoard(boardId, cardId);

			const item = card.items.find(({ votes: itemVotes }) =>
				arrayIdToString(itemVotes as unknown as string[]).includes(userId.toString())
			);

			if (!item) return null;

			// const votesOfUser = (item.votes as unknown as string[]).filter(
			// 	(vote) => vote.toString() === userId.toString()
			// );

			// const itemVotesToReduce =
			// 	votesOfUser.length / currentCount >= 1 ? currentCount : votesOfUser.length;

			await this.deleteVoteFromCard(boardId, cardId, userId, item._id.toString(), -currentCount);

			// currentCount -= itemVotesToReduce;
			// }
		}
	}

	setCardVotes(
		boardId: string,
		mappedVotes: string[],
		cardId: string,
		session: ClientSession
	): Promise<UpdateResult> {
		return this.boardModel
			.updateOne(
				{
					_id: boardId,
					'columns.cards._id': cardId
				},
				{
					$set: {
						'columns.$.cards.$[c].votes': mappedVotes
					}
				},
				{
					arrayFilters: [{ 'c._id': cardId }],
					session
				}
			)
			.lean()
			.exec();
	}

	setCardItemVotes(
		boardId: string,
		cardItemId: string,
		votes: string[],
		cardId: string,
		session: ClientSession
	): Promise<UpdateResult> {
		return this.boardModel
			.updateOne(
				{
					_id: boardId,
					'columns.cards.items._id': cardItemId
				},
				{
					$set: {
						'columns.$.cards.$[c].items.$[i].votes': votes
					}
				},
				{
					arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
					session
				}
			)
			.lean()
			.exec();
	}
}
