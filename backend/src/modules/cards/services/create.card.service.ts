import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import isEmpty from 'src/libs/utils/isEmpty';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import CardDto from '../dto/card.dto';
import { CreateCardService } from '../interfaces/services/create.card.service.interface';
import CardItem from '../schemas/card.item.schema';
import { pushCardIntoPosition } from '../shared/push.card';

@Injectable()
export default class CreateCardServiceImpl implements CreateCardService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

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

		const { columns, hideCards, hideVotes } = await pushCardIntoPosition(
			boardId,
			colIdToAdd,
			0,
			card,
			this.boardModel
		);

		if (!columns) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIndex = columns.findIndex((col) => col._id.toString() === colIdToAdd);

		return { newCard: columns[colIndex].cards[0], hideCards, hideVotes };
	}
}
