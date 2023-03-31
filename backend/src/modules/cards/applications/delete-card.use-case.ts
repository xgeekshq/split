import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import DeleteCardUseCaseDto from '../dto/useCase/delete-card.use-case.dto';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import {
	CARD_NOT_FOUND,
	CARD_NOT_REMOVED,
	DELETE_FAILED,
	DELETE_VOTE_FAILED
} from 'src/libs/exceptions/messages';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { getUserWithVotes } from '../utils/get-user-with-votes';

@Injectable()
export class DeleteCardUseCase implements UseCase<DeleteCardUseCaseDto, void> {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	async execute(deleteCardUseCaseDto: DeleteCardUseCaseDto) {
		const { boardId, cardId } = deleteCardUseCaseDto;
		await this.cardRepository.startTransaction();
		await this.updateBoardUserService.startTransaction();
		try {
			try {
				await this.deletedVotesFromCard(boardId, cardId);

				const result = await this.cardRepository.updateCardsFromBoard(boardId, cardId, true);

				if (result.modifiedCount !== 1) throw new Error(CARD_NOT_REMOVED);
			} catch (e) {
				await this.cardRepository.abortTransaction();
				await this.updateBoardUserService.abortTransaction();
				throw new Error(e.message);
			}

			await this.cardRepository.commitTransaction();
			await this.updateBoardUserService.commitTransaction();
		} catch (e) {
			throw new DeleteFailedException(e.message ? e.message : DELETE_FAILED);
		} finally {
			await this.cardRepository.endSession();
			await this.updateBoardUserService.endSession();
		}

		return null;
	}

	private async deletedVotesFromCard(boardId: string, cardId: string) {
		const getCard = await this.getCardService.getCardFromBoard(boardId, cardId);
		let votesByUsers;

		if (!getCard) {
			throw Error(CARD_NOT_FOUND);
		}

		if (getCard.votes?.length) {
			votesByUsers = getUserWithVotes(getCard.votes);
		}

		if (getCard.items[0].votes) {
			votesByUsers = getUserWithVotes(getCard.items[0].votes);
		}

		if (votesByUsers) {
			try {
				const result = await this.updateBoardUserService.updateManyUserVotes(
					boardId,
					votesByUsers,
					true,
					true
				);

				if (result.ok !== 1) {
					throw new Error(DELETE_VOTE_FAILED);
				}
			} catch (e) {
				throw new Error(e.message);
			}
		}
	}
}
