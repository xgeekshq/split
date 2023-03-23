import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import CreateCardUseCaseDto from '../dto/useCase/params/create-card.use-case.dto';
import { CardRepositoryInterface } from '../repository/card.repository.interface';
import isEmpty from 'src/libs/utils/isEmpty';
import CardItem from '../entities/card.item.schema';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import CreateCardResUseCaseDto from '../dto/useCase/response/create-card-res.use-case.dto';
import { replaceCard } from 'src/modules/boards/utils/clean-board';
import Card from '../entities/card.schema';
import { hideText } from 'src/libs/utils/hideText';

@Injectable()
export class CreateCreateCardUseCase
	implements UseCase<CreateCardUseCaseDto, CreateCardResUseCaseDto>
{
	constructor(
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async execute(createCardUseCaseDto: CreateCardUseCaseDto) {
		const { createCardDto, userId, boardId } = createCardUseCaseDto;
		const { card, colIdToAdd } = createCardDto;

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

		const board = await this.cardRepository.pushCardWithPopulate(boardId, colIdToAdd, 0, card);

		if (!board.columns) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIndex = board.columns.findIndex((col) => col._id.toString() === colIdToAdd);

		const newCard = board.columns[colIndex].cards[0];

		if (!newCard) throw new BadRequestException(INSERT_FAILED);

		const cardWithHiddenInfo = replaceCard(
			newCard,
			hideText(userId),
			board.hideCards,
			board.hideVotes
		);
		const newCardToSocket = cardWithHiddenInfo as Card;

		return {
			newCardToReturn: newCard,
			newCardToSocket: newCardToSocket
		};
	}
}
