import { Inject, Injectable, Logger } from '@nestjs/common';
import { CREATE_VOTE_SERVICE, DELETE_VOTE_SERVICE, VOTE_REPOSITORY } from '../constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { DELETE_VOTE_FAILED, INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import CardItemVoteUseCaseDto from '../dto/useCase/card-item-vote.use-case.dto';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { getVotesFromCardItem } from '../utils/getVotesFromCardItem';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { UPDATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

@Injectable()
export class CardItemVoteUseCase implements UseCase<CardItemVoteUseCaseDto, void> {
	private logger: Logger = new Logger('CreateVoteService');
	constructor(
		@Inject(CREATE_VOTE_SERVICE)
		private readonly createVoteService: CreateVoteServiceInterface,
		@Inject(DELETE_VOTE_SERVICE)
		private readonly deleteVoteService: DeleteVoteServiceInterface,
		@Inject(VOTE_REPOSITORY)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(UPDATE_BOARD_USER_SERVICE)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	async execute({
		boardId,
		cardId,
		userId,
		cardItemId,
		count,
		completionHandler
	}: CardItemVoteUseCaseDto) {
		if (count < 0) {
			await this.deleteVoteFromCard(boardId, cardId, userId, cardItemId, count);
		} else {
			await this.addVoteToCardAndUser(boardId, cardId, userId, cardItemId, count);
		}

		completionHandler();
	}

	private async addVoteToCardAndUser(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		retryCount?: number
	) {
		await this.createVoteService.canUserVote(boardId, userId, count);

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
			await this.createVoteService.incrementVoteUser(boardId, userId, count, withSession);

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
				await this.addVoteToCardAndUser(
					boardId,
					cardId,
					userId,
					cardItemId,
					count,
					retryCountOperation
				);
			} else {
				throw new InsertFailedException(INSERT_VOTE_FAILED);
			}
		}
	}

	private async deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		retryCount?: number
	) {
		await this.deleteVoteService.canUserDeleteVote(boardId, userId, count, cardId, cardItemId);

		const cardItem = await this.deleteVoteService.getCardItemFromBoard(boardId, cardId, cardItemId);

		const votes = getVotesFromCardItem(cardItem.votes as string[], String(userId), count);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		try {
			await this.removeVotesFromCardItemAndUserOperations(
				boardId,
				cardItemId,
				votes,
				cardId,
				count,
				userId,
				retryCount
			);

			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);

			throw new DeleteFailedException(DELETE_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	private async removeVotesFromCardItemAndUserOperations(
		boardId: string,
		cardItemId: string,
		votes: string[],
		cardId: string,
		count: number,
		userId: string,
		retryCount?: number
	) {
		let retryCountOperation = retryCount ?? 0;
		const withSession = true;

		try {
			await this.deleteVoteService.removeVotesFromCardItem(
				boardId,
				cardItemId,
				votes,
				cardId,
				withSession
			);
			await this.deleteVoteService.decrementVoteUser(boardId, userId, count, withSession);
		} catch (e) {
			this.logger.error(e);

			await this.updateBoardUserService.abortTransaction();
			await this.voteRepository.abortTransaction();

			if (e.code === WRITE_LOCK_ERROR && retryCountOperation < 5) {
				retryCountOperation++;
				await this.updateBoardUserService.endSession();
				await this.voteRepository.endSession();
				await this.deleteVoteFromCard(
					boardId,
					cardId,
					userId,
					cardItemId,
					count,
					retryCountOperation
				);
			} else {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}
		}
	}
}
