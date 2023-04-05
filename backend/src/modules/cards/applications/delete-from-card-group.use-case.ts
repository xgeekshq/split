import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import {
	CARD_ITEM_NOT_FOUND,
	CARD_NOT_FOUND,
	DELETE_FAILED,
	DELETE_VOTE_FAILED,
	UPDATE_FAILED
} from 'src/libs/exceptions/messages';
import DeleteFromCardGroupUseCaseDto from '../dto/useCase/delete-fom-card-group.use-case.dto';
import CardItem from '../entities/card.item.schema';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { getUserWithVotes } from '../utils/get-user-with-votes';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';
import Card from '../entities/card.schema';
import { CardNotFoundException } from 'src/libs/exceptions/cardNotFoundException';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { isEmpty } from 'class-validator';

@Injectable()
export class DeleteFromCardGroupUseCase implements UseCase<DeleteFromCardGroupUseCaseDto, void> {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private readonly getCardService: GetCardServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	private logger: Logger = new Logger(DeleteFromCardGroupUseCase.name);

	async execute({ boardId, cardId, cardItemId, completionHandler }: DeleteFromCardGroupUseCaseDto) {
		await this.cardRepository.startTransaction();
		await this.updateBoardUserService.startTransaction();
		try {
			try {
				await this.removeUserVotes(boardId, cardItemId);

				const card = await this.getCardService.getCardFromBoard(boardId, cardId);

				if (!card) throw new CardNotFoundException(CARD_NOT_FOUND);

				const cardItems = card?.items.filter((item) => item._id.toString() !== cardItemId);

				const isLastItem =
					card &&
					cardItems?.length === 1 &&
					(!isEmpty(card.votes.length) || !isEmpty(card.comments.length));

				if (isLastItem) {
					await this.refactorLastItem(boardId, cardId, card, cardItems);
				}
				const result = await this.cardRepository.deleteCardFromCardItems(
					boardId,
					cardId,
					cardItemId,
					true
				);

				if (result.modifiedCount != 1) throw new DeleteFailedException(DELETE_FAILED);
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

	private async removeUserVotes(boardId: string, cardItemId: string) {
		const getCardItem = await this.getCardService.getCardItemFromGroup(boardId, cardItemId);

		if (!getCardItem) {
			throw new NotFoundException(CARD_ITEM_NOT_FOUND);
		}
		const usersWithVotes = getUserWithVotes(getCardItem.votes);

		if (!isEmpty(getCardItem.votes)) {
			try {
				const bulkWriteResult = await this.updateBoardUserService.updateManyUserVotes(
					boardId,
					usersWithVotes,
					true,
					true
				);

				if (!bulkWriteResult.ok) {
					throw new DeleteFailedException(DELETE_VOTE_FAILED);
				}
			} catch (e) {
				throw new DeleteFailedException(e.message);
			}
		}
	}

	private async refactorLastItem(
		boardId: string,
		cardId: string,
		card: Card,
		cardItems: CardItem[]
	) {
		const newVotes = [...card.votes, ...cardItems[0].votes];
		const newComments = [...card.comments, ...cardItems[0].comments];
		try {
			const boardWithLastCardRefactored = await this.cardRepository.refactorLastCardItem(
				boardId,
				cardId,
				newVotes,
				newComments,
				cardItems
			);

			if (!boardWithLastCardRefactored) throw new UpdateFailedException(UPDATE_FAILED);
		} catch (e) {
			throw new UpdateFailedException(e.message);
		}
	}
}
