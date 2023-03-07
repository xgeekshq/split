import { Inject } from '@nestjs/common';
import {
	CARD_NOT_FOUND,
	CARD_NOT_INSERTED,
	CARD_NOT_REMOVED,
	UPDATE_FAILED
} from 'src/libs/exceptions/messages';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import { UnmergeCardServiceInterface } from '../interfaces/services/unmerge.card.service.interface';
import { UpdateCardServiceInterface } from '../interfaces/services/update.card.service.interface';
import { TYPES } from '../interfaces/types';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

export class UnmergeCardServiceImpl implements UnmergeCardServiceInterface {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private readonly cardService: GetCardServiceInterface,
		@Inject(TYPES.services.UpdateCardService)
		private updateCardService: UpdateCardServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async unmergeAndUpdatePosition(
		boardId: string,
		cardGroupId: string,
		draggedCardId: string,
		columnId: string,
		position: number
	) {
		await this.cardRepository.startTransaction();

		try {
			const cardItemToMove = await this.cardService.getCardItemFromGroup(boardId, draggedCardId);

			if (!cardItemToMove) return null;

			const pullResult = await this.updateCardService.pullCardItem(boardId, draggedCardId, true);

			if (pullResult.modifiedCount !== 1) throw Error(CARD_NOT_REMOVED);

			const cardGroup = await this.cardService.getCardFromBoard(boardId, cardGroupId);

			if (!cardGroup) throw Error(CARD_NOT_FOUND);

			const items = cardGroup.items.filter((item) => item._id.toString() !== draggedCardId);

			if (items.length === 1) {
				const [{ comments, votes: itemVotes }] = items;
				const newComments = cardGroup.comments.concat(comments);

				const newVotes = (cardGroup.votes as unknown as string[]).concat(
					itemVotes as unknown as string[]
				);

				const updateCard = await this.cardRepository.updateCardFromGroupOnUnmerge(
					boardId,
					cardGroupId,
					items[0],
					newComments,
					newVotes,
					true
				);

				if (!updateCard) throw Error(UPDATE_FAILED);
			}

			const newCardItem = { ...cardItemToMove };
			const itemId = newCardItem._id;
			delete newCardItem._id;

			const newCard = {
				_id: itemId,
				...cardItemToMove,
				comments: [],
				votes: [],
				items: [newCardItem]
			};

			const pushResult = await this.cardRepository.pushCard(
				boardId,
				columnId,
				position,
				newCard,
				true
			);

			if (!pushResult) throw Error(CARD_NOT_INSERTED);
			await this.cardRepository.commitTransaction();
			await this.cardRepository.endSession();

			const newCardSaved = await this.cardService.getCardFromBoard(boardId, itemId);

			return newCardSaved.items[0]._id;
		} catch (e) {
			await this.cardRepository.abortTransaction();
		} finally {
			await this.cardRepository.endSession();
		}

		throw Error(CARD_NOT_REMOVED);
	}
}
