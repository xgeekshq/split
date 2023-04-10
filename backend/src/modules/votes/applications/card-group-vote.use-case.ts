import { Inject, Injectable, Logger } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { VoteRepositoryInterface } from '../interfaces/repositories/vote.repository.interface';
import CardGroupVoteUseCaseDto from '../dto/useCase/card-group-vote.use-case.dto';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';

@Injectable()
export class CardGroupVoteUseCase implements UseCase<CardGroupVoteUseCaseDto, void> {
	private logger: Logger = new Logger('CreateVoteService');
	constructor(
		@Inject(TYPES.services.CreateVoteService)
		private readonly createVoteService: CreateVoteServiceInterface,
		@Inject(TYPES.repositories.VoteRepository)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface,
		@Inject(TYPES.services.DeleteVoteService)
		private readonly deleteVoteService: DeleteVoteServiceInterface
	) {}

	async execute({ boardId, cardId, userId, count, completionHandler }: CardGroupVoteUseCaseDto) {
		if (count < 0) {
			await this.deleteVoteService.deleteVoteFromCardGroup(boardId, cardId, userId, count);
		} else {
			await this.addVoteToCardGroupAndUser(boardId, userId, count, cardId);
		}

		completionHandler();
	}

	private async addVoteToCardGroupAndUser(
		boardId: string,
		userId: string,
		count: number,
		cardId: string,
		retryCount?: number
	) {
		await this.createVoteService.canUserVote(boardId, userId, count);

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
			await this.createVoteService.incrementVoteUser(boardId, userId, count, withSession);
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
				await this.addVoteToCardGroupAndUser(boardId, userId, count, cardId, retryCountOperation);
			} else {
				throw new InsertFailedException(INSERT_VOTE_FAILED);
			}
		}
	}
}