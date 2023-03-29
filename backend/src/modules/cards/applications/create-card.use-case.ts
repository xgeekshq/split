import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import CreateCardUseCaseDto from '../dto/useCase/create-card.use-case.dto';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import isEmpty from 'src/libs/utils/isEmpty';
import CardItem from '../entities/card.item.schema';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import CardCreationPresenter from '../dto/useCase/presenters/create-card-res.use-case.dto';
import { replaceCard } from 'src/modules/boards/utils/clean-board';
import Card from '../entities/card.schema';
import { hideText } from 'src/libs/utils/hideText';
import CardDto from '../dto/card.dto';

@Injectable()
export class CreateCardUseCase implements UseCase<CreateCardUseCaseDto, CardCreationPresenter> {
	constructor(
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async execute(createCardUseCaseDto: CreateCardUseCaseDto) {
		const { createCardDto, userId, boardId } = createCardUseCaseDto;
		const { card, colIdToAdd } = createCardDto;

		const transformedCard = this.transformCardToStore(card, userId);

		const board = await this.cardRepository.pushCardWithPopulate(
			boardId,
			colIdToAdd,
			0,
			transformedCard
		);

		if (!board.columns) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const newCard = this.extractCardFromBoard(board, colIdToAdd);

		const newCardToSocket = this.transformCardForSocket(
			newCard,
			userId,
			board.hideCards,
			board.hideVotes
		);

		return {
			newCardToReturn: newCard,
			newCardToSocket: newCardToSocket
		};
	}

	private transformCardToStore(card: CardDto, userId: string) {
		card.createdBy = userId;

		if (isEmpty(card.items)) {
			(card.items as CardItem[]).push({
				text: card.text,
				createdBy: userId,
				comments: [],
				votes: [],
				anonymous: false,
				createdByTeam: undefined,
				createdAt: new Date()
			});
		} else {
			card.items[0].createdBy = userId;
		}

		return card;
	}

	private transformCardForSocket(newCard, userId: string, hideCards, hideVotes): Card {
		const cardWithHiddenInfo = replaceCard(
			newCard,
			hideText(userId.toString()),
			hideCards,
			hideVotes
		);

		return cardWithHiddenInfo as Card;
	}

	//Extract the card from the populated board
	private extractCardFromBoard(board, colIdToAdd) {
		try {
			const colIndex = board.columns.findIndex((col) => col._id.toString() === colIdToAdd);

			const newCard = board.columns[colIndex].cards[0];

			return newCard;
		} catch {
			throw new BadRequestException(INSERT_FAILED);
		}
	}
}
