import { Inject, Injectable, Logger } from '@nestjs/common';
import { TYPES } from '../../interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CreateVoteServiceInterface } from '../../interfaces/services/create.vote.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { INSERT_VOTE_FAILED } from 'src/libs/exceptions/messages';
import { WRITE_LOCK_ERROR } from 'src/libs/constants/database';
import { VoteRepositoryInterface } from '../../interfaces/repositories/vote.repository.interface';
import CreateCardGroupVoteUseCaseDto from '../../dto/useCase/create-card-group-vote.use-case.dto';

@Injectable()
export class CreateCardGroupVoteUseCase implements UseCase<CreateCardGroupVoteUseCaseDto, void> {
	private logger: Logger = new Logger('CreateVoteService');
	constructor(
		@Inject(TYPES.services.CreateVoteService)
		private readonly createVoteService: CreateVoteServiceInterface,
		@Inject(TYPES.repositories.VoteRepository)
		private readonly voteRepository: VoteRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	async execute({ boardId, cardId, userId, count, retryCount }: CreateCardGroupVoteUseCaseDto) {
		await this.createVoteService.canUserVote(boardId, userId, count);

		await this.updateBoardUserService.startTransaction();
		await this.voteRepository.startTransaction();

		try {
			await this.addVoteToCardGroupAndUser(boardId, userId, count, cardId, retryCount);
			await this.updateBoardUserService.commitTransaction();
			await this.voteRepository.commitTransaction();
		} catch (e) {
			throw new InsertFailedException(INSERT_VOTE_FAILED);
		} finally {
			await this.updateBoardUserService.endSession();
			await this.voteRepository.endSession();
		}
	}

	private async addVoteToCardGroupAndUser(
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
				await this.execute({ boardId, cardId, userId, count, retryCount: retryCountOperation });
			} else {
				throw new InsertFailedException(INSERT_VOTE_FAILED);
			}
		}
	}
}
