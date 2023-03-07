import { VotesBoardUserRepositoryInterface } from '../repositories/votes-board-user.repository.interface';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { BOARD_NOT_FOUND, INSERT_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { TYPES } from '../interfaces/types';
import { VotesBoardRepositoryInterface } from '../repositories/votes-board.repository.interface';

@Injectable()
export default class CreateVoteService implements CreateVoteServiceInterface {
	constructor(
		@Inject(TYPES.repositories.VotesBoardRepository)
		private readonly boardRepository: VotesBoardRepositoryInterface,
		@Inject(TYPES.repositories.VotesBoardUserRepository)
		private readonly boardUserRepository: VotesBoardUserRepositoryInterface
	) {}
	private logger: Logger = new Logger('CreateVoteService');

	async addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		let retryCount = 0;
		await this.boardUserRepository.startTransaction();
		await this.boardRepository.startTransaction();
		const withSession = true;

		const canUserVote = await this.canUserVote(boardId, userId, count);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		try {
			await this.incrementVoteUser(boardId, userId, count, withSession);

			const updatedBoard = await this.boardRepository.findBoardByFieldAndUpdate(
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
					arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }]
				},
				null,
				withSession
			);

			if (!updatedBoard) throw new BadRequestException(INSERT_VOTE_FAILED);

			await this.boardUserRepository.commitTransaction();
			await this.boardRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await this.boardUserRepository.abortTransaction();
			await this.boardRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await this.boardUserRepository.endSession();
				await this.boardRepository.endSession();
				await this.addVoteToCard(boardId, cardId, userId, cardItemId, count);
			} else {
				throw new BadRequestException(INSERT_VOTE_FAILED);
			}
		} finally {
			await this.boardUserRepository.endSession();
			await this.boardRepository.endSession();
		}
	}

	async addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		let retryCount = 0;
		await this.boardUserRepository.startTransaction();
		await this.boardRepository.startTransaction();
		const withSession = true;

		const canUserVote = await this.canUserVote(boardId, userId, count);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		try {
			await this.incrementVoteUser(boardId, userId, count, withSession);
			const updatedBoard = await this.boardRepository.findBoardByFieldAndUpdate(
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
					arrayFilters: [{ 'c._id': cardId }]
				},
				null,
				withSession
			);

			if (!updatedBoard) throw new BadRequestException(INSERT_VOTE_FAILED);
			await this.boardUserRepository.commitTransaction();
			await this.boardRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await this.boardUserRepository.abortTransaction();
			await this.boardRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await this.boardUserRepository.endSession();
				await this.boardRepository.endSession();
				await this.addVoteToCardGroup(boardId, cardId, userId, count);
			} else {
				throw new BadRequestException(INSERT_VOTE_FAILED);
			}
		} finally {
			await this.boardUserRepository.endSession();
			await this.boardRepository.endSession();
		}
	}

	/* #################### HELPERS #################### */

	private async canUserVote(boardId: string, userId: string, count: number): Promise<boolean> {
		const board = await this.boardRepository.findOneById(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		if (board.maxVotes === null || board.maxVotes === undefined) {
			return true;
		}
		const maxVotes = Number(board.maxVotes);

		const boardUserFound = await this.boardUserRepository.findOneByFieldWithQuery({
			board: boardId,
			user: userId
		});

		const userCanVote = boardUserFound?.votesCount !== undefined && boardUserFound?.votesCount >= 0;

		return userCanVote ? boardUserFound.votesCount + count <= maxVotes : false;
	}

	private async incrementVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean
	) {
		const updatedBoardUser = await this.boardUserRepository.findBoardUserByFieldAndUpdate(
			{
				user: userId,
				board: boardId
			},
			{
				$inc: { votesCount: count }
			},
			null,
			null,
			withSession
		);

		if (!updatedBoardUser) throw new BadRequestException(UPDATE_FAILED);
	}
}
