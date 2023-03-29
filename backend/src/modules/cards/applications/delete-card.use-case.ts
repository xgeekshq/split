import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import DeleteCardUseCaseDto from '../dto/useCase/delete-card.use-case.dto';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';
import * as Votes from 'src/modules/votes/interfaces/types';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { DELETE_VOTE_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export class DeleteCardUseCase implements UseCase<DeleteCardUseCaseDto, void> {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private getCardService: GetCardServiceInterface,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async execute(deleteCardUseCaseDto: DeleteCardUseCaseDto) {
		const { boardId, cardId } = deleteCardUseCaseDto;
		await this.cardRepository.startTransaction();
		try {
			await this.deletedVotesFromCard(boardId, cardId);
			const result = await this.cardRepository.updateCardsFromBoard(boardId, cardId, true);

			if (result.modifiedCount != 1) throw new UpdateFailedException();
			await this.cardRepository.commitTransaction();
		} catch (e) {
			await this.cardRepository.abortTransaction();
			throw new DeleteFailedException(DELETE_VOTE_FAILED);
		} finally {
			await this.cardRepository.endSession();
		}

		return null;
	}

	private async deletedVotesFromCard(boardId: string, cardId: string) {
		const getCard = await this.getCardService.getCardFromBoard(boardId, cardId);

		if (!getCard) {
			throw Error(UPDATE_FAILED);
		}

		if (getCard.votes?.length) {
			const promises = getCard.votes.map((voteUserId) => {
				return this.deleteVoteService.decrementVoteUser(boardId, voteUserId);
			});
			const results = await Promise.all(promises);

			if (!results) {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}
		}

		if (Array.isArray(getCard.items)) {
			const promises = [];
			getCard.items.forEach(async (current) => {
				current.votes.forEach(async (currentVote) => {
					promises.push(this.deleteVoteService.decrementVoteUser(boardId, currentVote));
				});
			});
			const results = await Promise.all(promises);

			if (!results) {
				throw new DeleteFailedException(DELETE_VOTE_FAILED);
			}
		}
	}
}
