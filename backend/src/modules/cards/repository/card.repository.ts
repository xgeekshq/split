import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import CardItem from '../entities/card.item.schema';
import Card from '../entities/card.schema';
import { CardRepositoryInterface } from './card.repository.interface';

@Injectable()
export class CardRepository
	extends MongoGenericRepository<Board>
	implements CardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	/* GET CARD */
	getCardFromBoard(boardId: string, cardId: string): Promise<Card[]> {
		return this.aggregateByQuery([
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
		]);
	}

	getCardItemFromGroup(boardId: string, cardItemId: string): Promise<CardItem[]> {
		return this.aggregateByQuery([
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
	}
}
