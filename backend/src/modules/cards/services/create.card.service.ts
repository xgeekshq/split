import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import isEmpty from 'src/libs/utils/isEmpty';
import CardDto from '../dto/card.dto';
import { CreateCardServiceInterface } from '../interfaces/services/create.card.service.interface';
import CardItem from '../entities/card.item.schema';
import { TYPES } from '../interfaces/types';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

@Injectable()
export default class CreateCardService implements CreateCardServiceInterface {
	constructor(
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async create(boardId: string, userId: string, card: CardDto, colIdToAdd: string) {
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

		const populateBoard = [
			{
				path: 'columns.cards.createdBy',
				select: '_id firstName lastName'
			},
			{
				path: 'columns.cards.comments.createdBy',
				select: '_id  firstName lastName'
			},
			{
				path: 'columns.cards.items.createdBy',
				select: '_id firstName lastName'
			},
			{
				path: 'columns.cards.items.comments.createdBy',
				select: '_id firstName lastName'
			}
		];

		const board = await this.cardRepository.pushCard(
			boardId,
			colIdToAdd,
			0,
			card,
			null,
			populateBoard
		);

		if (!board.columns) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIndex = board.columns.findIndex((col) => col._id.toString() === colIdToAdd);

		return {
			newCard: board.columns[colIndex].cards[0],
			hideCards: board.hideCards,
			hideVotes: board.hideVotes
		};
	}
}
