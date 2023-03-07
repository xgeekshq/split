import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { GetCardServiceInterface } from '../interfaces/services/get.card.service.interface';
import * as Cards from 'src/modules/cards/interfaces/types';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

@Injectable()
export default class GetCardServiceImpl implements GetCardServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(Cards.TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async getCardFromBoard(boardId: string, cardId: string) {
		const result = await this.cardRepository.getCardFromBoard(boardId, cardId);

		return !isEmpty(result) ? result[0] : null;
	}

	async getCardItemFromGroup(boardId: string, cardItemId: string) {
		const result = await this.cardRepository.getCardItemFromGroup(boardId, cardItemId);

		return !isEmpty(result) ? result[0] : null;
	}
}
