import { GetBoardUserServiceInterface } from '../../boardUsers/interfaces/services/get.board.user.service.interface';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { BOARD_NOT_FOUND, INSERT_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { TYPES } from 'src/modules/votes/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';

@Injectable()
export default class CreateVoteService implements CreateVoteServiceInterface {
	constructor(
		@Inject(TYPES.repositories.VoteRepository)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface
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
		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();
		const withSession = true;

		const canUserVote = await this.canUserVote(boardId, userId, count);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

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

			if (!updatedBoard) throw new BadRequestException(INSERT_VOTE_FAILED);

			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.addVoteToCard(boardId, cardId, userId, cardItemId, count);
			} else {
				throw new BadRequestException(INSERT_VOTE_FAILED);
			}
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	async addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		let retryCount = 0;
		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();
		const withSession = true;

		const canUserVote = await this.canUserVote(boardId, userId, count);

		if (!canUserVote) throw new BadRequestException(INSERT_VOTE_FAILED);

		try {
			await this.incrementVoteUser(boardId, userId, count, withSession);
			const updatedBoard = await this.voteRepository.insertCardGroupVote(
				boardId,
				userId,
				count,
				cardId,
				withSession
			);

			if (!updatedBoard) throw new BadRequestException(INSERT_VOTE_FAILED);
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCount < 5) {
				retryCount++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.addVoteToCardGroup(boardId, cardId, userId, count);
			} else {
				throw new BadRequestException(INSERT_VOTE_FAILED);
			}
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	/* #################### HELPERS #################### */

	private async canUserVote(boardId: string, userId: string, count: number): Promise<boolean> {
		const board = await this.voteRepository.findOneById(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		if (board.maxVotes === null || board.maxVotes === undefined) {
			return true;
		}
		const maxVotes = Number(board.maxVotes);

		const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, userId);

		const userCanVote = boardUserFound?.votesCount !== undefined && boardUserFound?.votesCount >= 0;

		return userCanVote ? boardUserFound.votesCount + count <= maxVotes : false;
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

		if (!updatedBoardUser) throw new BadRequestException(UPDATE_FAILED);
	}
}
