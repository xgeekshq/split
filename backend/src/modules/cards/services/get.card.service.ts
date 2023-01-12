import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model, Types } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import CardItem from '../schemas/card.item.schema';
import Card from '../schemas/card.schema';

@Injectable()
export default class GetCardServiceImpl implements GetCardService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	async getCardFromBoard(boardId: string, cardId: string) {
		const result = await this.boardModel
			.aggregate([
				{
					$match: {
						_id: new Types.ObjectId(boardId),
						'columns.cards._id': new Types.ObjectId(cardId)
					}
				},
				{
					$unwind: {
						path: '$columns'
					}
				},
				{
					$unwind: {
						path: '$columns.cards'
					}
				},
				{
					$project: {
						card: '$columns.cards',
						_id: 0
					}
				},
				{
					$replaceRoot: {
						newRoot: '$card'
					}
				},
				{
					$match: {
						_id: new Types.ObjectId(cardId)
					}
				}
			])
			.exec();

		return !isEmpty(result) ? (result[0] as Card) : null;
	}

	async getCardItemFromGroup(boardId: string, cardItemId: string) {
		const result = await this.boardModel.aggregate([
			{
				$match: {
					_id: new Types.ObjectId(boardId),
					'columns.cards.items._id': new Types.ObjectId(cardItemId)
				}
			},
			{
				$unwind: {
					path: '$columns'
				}
			},
			{
				$unwind: {
					path: '$columns.cards'
				}
			},
			{
				$unwind: {
					path: '$columns.cards.items'
				}
			},
			{
				$project: {
					card: '$columns.cards.items',
					_id: 0
				}
			},
			{
				$replaceRoot: {
					newRoot: '$card'
				}
			},
			{
				$match: {
					_id: new Types.ObjectId(cardItemId)
				}
			}
		]);

		return !isEmpty(result) ? (result[0] as CardItem) : null;
	}
}
