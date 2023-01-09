import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import isEmpty from 'src/libs/utils/isEmpty';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';
import CardDto from '../dto/card.dto';
import { CreateCardService } from '../interfaces/services/create.card.service.interface';
import { pushCardIntoPosition } from '../shared/push.card';

@Injectable()
export default class CreateCardServiceImpl implements CreateCardService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	async create(boardId: string, userId: string, card: CardDto, colIdToAdd: string) {
		card.createdBy = userId;

		if (isEmpty(card.items)) {
			(card.items as any[]).push({
				text: card.text,
				createdBy: userId,
				comments: [],
				votes: [],
				anonymous: false
			});
		} else {
			card.items[0].createdBy = userId;
		}

		return (await pushCardIntoPosition(boardId, colIdToAdd, 0, card, this.boardModel)).populate(
			BoardDataPopulate
		);
	}
}
