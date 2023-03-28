import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import {
	CARD_NOT_FOUND,
	CARD_NOT_INSERTED,
	CARD_NOT_REMOVED,
	UPDATE_FAILED
} from 'src/libs/exceptions/messages';
import UnmergeCardUseCaseDto from '../dto/useCase/unmerge-card.use-case.dto';

@Injectable()
export class UnmergeCardUseCase implements UseCase<UnmergeCardUseCaseDto, string> {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private readonly cardService: GetCardServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async execute(unMergeCardDto: UnmergeCardUseCaseDto) {
		const { boardId, draggedCardId } = unMergeCardDto;
		await this.cardRepository.startTransaction();

		try {
			const cardItemToMove = await this.cardService.getCardItemFromGroup(boardId, draggedCardId);

			if (!cardItemToMove) return null;

			const itemId = await this.unmergeCard(cardItemToMove, unMergeCardDto);

			await this.cardRepository.commitTransaction();

			const newCardSaved = await this.cardService.getCardFromBoard(boardId, itemId);

			return newCardSaved.items[0]._id;
		} catch (e) {
			throw Error(CARD_NOT_REMOVED);
		} finally {
			await this.cardRepository.endSession();
		}
	}

	private async unmergeCard(cardItemToMove, unMergeCardDto) {
		const { boardId, cardGroupId, draggedCardId } = unMergeCardDto;
		try {
			//Removes card from group
			const pullResult = await this.cardRepository.pullItem(boardId, draggedCardId, true);

			if (pullResult.modifiedCount !== 1) throw Error(CARD_NOT_REMOVED);

			const cardGroup = await this.cardService.getCardFromBoard(boardId, cardGroupId);

			if (!cardGroup) throw Error(CARD_NOT_FOUND);

			this.updateLastCardOnGroup(cardGroup, unMergeCardDto);

			const itemId = this.createNewCard(cardItemToMove, unMergeCardDto);

			return itemId;
		} catch {
			await this.cardRepository.abortTransaction();
		}
	}

	//When card group has only one item (!== draggedCardId) move the votes and comments to a new card
	private async updateLastCardOnGroup(cardGroup, unMergeCardDto) {
		const { boardId, cardGroupId, draggedCardId } = unMergeCardDto;

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
	}

	//Creates new card for the card that was removed from the group
	private async createNewCard(cardItemToMove, unMergeCardDto) {
		const { boardId, columnId, position } = unMergeCardDto;

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

		return itemId;
	}
}
