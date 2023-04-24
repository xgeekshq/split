import { Inject, Injectable, Logger } from '@nestjs/common';
import { CARD_REPOSITORY, GET_CARD_SERVICE } from '../constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import DeleteCardUseCaseDto from '../dto/useCase/delete-card.use-case.dto';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import {
	CARD_NOT_FOUND,
	CARD_NOT_REMOVED,
	DELETE_FAILED,
	DELETE_VOTE_FAILED
} from 'src/libs/exceptions/messages';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { getUserWithVotes } from '../utils/get-user-with-votes';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { CardNotFoundException } from 'src/libs/exceptions/cardNotFoundException';
import isEmpty from 'src/libs/utils/isEmpty';
import { UPDATE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

@Injectable()
export class DeleteCardUseCase implements UseCase<DeleteCardUseCaseDto, void> {
	constructor(
		@Inject(GET_CARD_SERVICE)
		private readonly getCardService: GetCardServiceInterface,
		@Inject(CARD_REPOSITORY)
		private readonly cardRepository: CardRepositoryInterface,
		@Inject(UPDATE_BOARD_USER_SERVICE)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	private logger: Logger = new Logger(DeleteCardUseCase.name);

	async execute({ boardId, cardId, completionHandler }: DeleteCardUseCaseDto) {
		await this.cardRepository.startTransaction();
		await this.updateBoardUserService.startTransaction();
		try {
			try {
				await this.deletedVotesFromCard(boardId, cardId);

				const result = await this.cardRepository.updateCardsFromBoard(boardId, cardId, true);

				if (result.modifiedCount !== 1) throw new UpdateFailedException(CARD_NOT_REMOVED);
			} catch (e) {
				await this.cardRepository.abortTransaction();
				await this.updateBoardUserService.abortTransaction();
				throw new DeleteFailedException(e.message);
			}

			await this.cardRepository.commitTransaction();
			await this.updateBoardUserService.commitTransaction();
			completionHandler();
		} catch (e) {
			this.logger.error(e);
			throw new DeleteFailedException(DELETE_FAILED);
		} finally {
			await this.cardRepository.endSession();
			await this.updateBoardUserService.endSession();
		}
	}

	private async deletedVotesFromCard(boardId: string, cardId: string) {
		const getCard = await this.getCardService.getCardFromBoard(boardId, cardId);
		let votesByUsers: Map<string, number>;

		if (!getCard) {
			throw new CardNotFoundException(CARD_NOT_FOUND);
		}

		if (!isEmpty(getCard.items[0].votes)) {
			votesByUsers = getUserWithVotes(getCard.items[0].votes);
		}

		if (votesByUsers?.size > 0) {
			try {
				const result = await this.updateBoardUserService.updateManyUserVotes(
					boardId,
					votesByUsers,
					true,
					true
				);

				if (!result.ok) {
					throw new UpdateFailedException(DELETE_VOTE_FAILED);
				}
			} catch (e) {
				throw new UpdateFailedException(e.message);
			}
		}
	}
}
