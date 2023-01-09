import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import isEmpty from 'src/libs/utils/isEmpty';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
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

		return (await pushCardIntoPosition(boardId, colIdToAdd, 0, card, this.boardModel)).populate([
			{
				path: 'users',
				select: 'user role -board votesCount',
				populate: { path: 'user', select: 'firstName email lastName _id' }
			},
			{
				path: 'team',
				select: 'name users -_id',
				populate: {
					path: 'users',
					select: 'user role',
					populate: { path: 'user', select: 'firstName lastName email joinedAt' }
				}
			},
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
			},
			{
				path: 'createdBy',
				select: '_id firstName lastName isSAdmin joinedAt'
			},
			{
				path: 'dividedBoards',
				select: '-__v -createdAt -id',
				populate: {
					path: 'users',
					select: 'role user'
				}
			}
		]);
	}
}
