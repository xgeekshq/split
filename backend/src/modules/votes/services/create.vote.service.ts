import { GetBoardUserServiceInterface } from '../../boardUsers/interfaces/services/get.board.user.service.interface';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { BOARD_NOT_FOUND, INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { TYPES } from 'src/modules/votes/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';

@Injectable()
export default class CreateVoteService implements CreateVoteServiceInterface {
	constructor(
		@Inject(TYPES.repositories.VoteRepository)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}
	private logger: Logger = new Logger('CreateVoteService');

	async addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		retryCount?: number
	) {
		await this.canUserVote(boardId, userId, count);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		try {
			await this.addVoteToCardAndUserOperations(
				boardId,
				userId,
				count,
				cardId,
				cardItemId,
				retryCount
			);
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			throw new InsertFailedException(INSERT_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	async addVoteToCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		retryCount?: number
	) {
		await this.canUserVote(boardId, userId, count);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		try {
			await this.addVoteToCardGroupAndUserOperations(boardId, userId, count, cardId, retryCount);
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			throw new InsertFailedException(INSERT_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	/* #################### HELPERS #################### */

	private async canUserVote(boardId: string, userId: string, count: number) {
		const canUserVoteResult = await this.verifyIfUserCanVote(boardId, userId, count);

		if (!canUserVoteResult) throw new InsertFailedException(INSERT_VOTE_FAILED);

		return;
	}

	private async verifyIfUserCanVote(
		boardId: string,
		userId: string,
		count: number
	): Promise<boolean> {
		const maxVotesOfBoard = await this.getBoardMaxVotes(boardId);

		if (maxVotesOfBoard === null || maxVotesOfBoard === undefined) {
			return true;
		}

		return await this.canBoardUserVote(boardId, userId, count, Number(maxVotesOfBoard));
	}

	private async getBoardMaxVotes(boardId: string) {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		return board.maxVotes;
	}

	private async canBoardUserVote(boardId: string, userId: string, count: number, maxVotes: number) {
		const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, userId);

		if (!boardUserFound) {
			return false;
		}

		const userCanVote = boardUserFound?.votesCount !== undefined && boardUserFound?.votesCount >= 0;

		return userCanVote ? boardUserFound.votesCount + count <= maxVotes : false;
	}

	private async addVoteToCardAndUserOperations(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		cardItemId: string,
		retryCount?: number
	) {
		let retryCountOperation = retryCount ?? 0;
		const withSession = true;
		try {
			await this.incrementVoteUser(boardId, userId, count, withSession);

			const votes = Array(count).fill(userId);

			const updatedBoard = await this.voteRepository.insertCardItemVote(
				boardId,
				cardId,
				cardItemId,
				votes,
				withSession
			);

			if (!updatedBoard) throw new InsertFailedException(INSERT_VOTE_FAILED);
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.addVoteToCard(boardId, cardId, userId, cardItemId, count, retryCountOperation);
			} else {
				throw new InsertFailedException(INSERT_VOTE_FAILED);
			}
		}
	}

	private async addVoteToCardGroupAndUserOperations(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		retryCount?: number
	) {
		let retryCountOperation = retryCount ?? 0;
		const withSession = true;
		try {
			await this.incrementVoteUser(boardId, userId, count, withSession);
			const updatedBoard = await this.voteRepository.insertCardGroupVote(
				boardId,
				userId,
				count,
				cardId,
				withSession
			);

			if (!updatedBoard) throw new InsertFailedException(INSERT_VOTE_FAILED);
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.addVoteToCardGroup(boardId, cardId, userId, count, retryCountOperation);
			} else {
				throw new InsertFailedException(INSERT_VOTE_FAILED);
			}
		}
	}

	private async incrementVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean
	) {
		const updatedBoardUser = await this.updateBoardUserService.updateVoteUser(
			boardId,
			userId,
			count,
			withSession
		);

		if (!updatedBoardUser) throw new UpdateFailedException();
	}
}
