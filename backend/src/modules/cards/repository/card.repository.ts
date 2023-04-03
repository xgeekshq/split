import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import {
	BoardDataPopulate,
	GetCardFromBoardPopulate
} from 'src/modules/boards/utils/populate-board';
import CardItem from '../entities/card.item.schema';
import Card from '../entities/card.schema';
import { CardRepositoryInterface } from './card.repository.interface';
import { UpdateResult } from 'mongodb';
import CardDto from '../dto/card.dto';
import Comment from 'src/modules/comments/schemas/comment.schema';
import User from 'src/modules/users/entities/user.schema';

@Injectable()
export class CardRepository
	extends MongoGenericRepository<BoardDocument>
	implements CardRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<BoardDocument>) {
		super(model);
	}

	/* CARD */

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

	/* UPDATE CARD */
	updateCardGroupText(
		boardId: string,
		cardId: string,
		userId: string,
		text: string
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$set: {
					'columns.$.cards.$[c].text': text
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId, 'c.createdBy': userId }],
				new: true
			},
			BoardDataPopulate
		);
	}

	updateCardFromGroupOnUnmerge(
		boardId: string,
		cardGroupId: string,
		cardItem: CardItem,
		newComments: Comment[],
		newVotes: string[],
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardGroupId
			},
			{
				$set: {
					'columns.$.cards.$[c].text': cardItem.text,
					'columns.$.cards.$[c].comments': [],
					'columns.$.cards.$[c].votes': [],
					'columns.$.cards.$[c].items.0.comments': newComments,
					'columns.$.cards.$[c].items.0.votes': newVotes,
					'columns.$.cards.$[c].createdBy': cardItem.createdBy,
					'columns.$.cards.$[c].createdByTeam': cardItem.createdByTeam,
					'columns.$.cards.$[c].anonymous': cardItem.anonymous
				}
			},
			{
				arrayFilters: [{ 'c._id': cardGroupId }]
			},
			null,
			withSession
		);
	}

	updateCardOnMerge(
		boardId: string,
		cardId: string,
		newItems: CardItem[],
		newVotes: string[],
		newComments: Comment[],
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$set: {
					'columns.$[].cards.$[c].items': newItems,
					'columns.$[].cards.$[c].votes': newVotes,
					'columns.$[].cards.$[c].comments': newComments
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }]
			},
			null,
			withSession
		);
	}

	updateCardsFromBoard(boardId: string, cardId: string, session?: boolean): Promise<UpdateResult> {
		return this.updateOneByField<UpdateResult>(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$pull: {
					'columns.$[].cards': { _id: cardId }
				}
			},
			null,
			session
		);
	}

	pullCard(boardId: string, cardId: string, session?: boolean): Promise<UpdateResult> {
		return this.updateOneByField<UpdateResult>(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$pull: {
					'columns.$[].cards': { _id: cardId }
				}
			},
			null,
			session
		);
	}

	pushCard(
		boardId: string,
		columnId: string,
		position: number,
		card: Card | CardDto,
		withSession?: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns._id': columnId
			},
			{
				$push: {
					'columns.$.cards': {
						$each: [card],
						$position: position
					}
				}
			},
			{ new: true },
			null,
			withSession
		);
	}

	pushCardWithPopulate(
		boardId: string,
		columnId: string,
		position: number,
		card: Card | CardDto
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns._id': columnId
			},
			{
				$push: {
					'columns.$.cards': {
						$each: [card],
						$position: position
					}
				}
			},
			{ new: true },
			GetCardFromBoardPopulate
		);
	}

	/* CARD ITEM */

	/*GET CARD */
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

	/*UPDATE CARD*/
	updateCardText(
		boardId: string,
		cardId: string,
		cardItemId: string,
		userId: string,
		text: string
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId,
				'columns.$.cards.$[card].createdBy': userId,
				'columns.$.cards.$[card].items.$[item].createdBy': userId
			},
			{
				$set: {
					'columns.$.cards.$[card].text': text,
					'columns.$.cards.$[card].items.$[item].text': text
				}
			},
			{
				arrayFilters: [
					{ 'card._id': cardId },
					{ 'item._id': cardItemId, 'item.createdBy': userId }
				],
				new: true
			},
			BoardDataPopulate
		);
	}

	pullItem(boardId: string, itemId: string, session?: boolean): Promise<UpdateResult> {
		return this.updateOneByField<UpdateResult>(
			{
				_id: boardId,
				'columns.cards.items._id': itemId
			},
			{
				$pull: {
					'columns.$[].cards.$[].items': { _id: itemId }
				}
			},
			{ new: true },
			session
		);
	}

	refactorLastCardItem(
		boardId: string,
		cardId: string,
		newVotes: (User | ObjectId | string)[],
		newComments: Comment[],
		cardItems: CardItem[]
	): Promise<Board> {
		const [{ text, createdBy }] = cardItems;

		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$set: {
					'columns.$.cards.$[card].items.$[cardItem].votes': newVotes,
					'columns.$.cards.$[card].votes': [],
					'columns.$.cards.$[card].items.$[cardItem].comments': newComments,
					'columns.$.cards.$[card].comments': [],
					'columns.$.cards.$[card].text': text,
					'columns.$.cards.$[card].createdBy': createdBy
				}
			},
			{
				arrayFilters: [{ 'card._id': cardId }, { 'cardItem._id': cardItems[0]._id }],
				new: true
			}
		);
	}

	deleteCardFromCardItems(
		boardId: string,
		cardId: string,
		cardItemId: string,
		session?: boolean
	): Promise<UpdateResult> {
		return this.updateOneByField(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$pull: {
					'columns.$.cards.$[card].items': {
						_id: cardItemId
					}
				}
			},
			{ arrayFilters: [{ 'card._id': cardId }], new: true },
			session
		);
	}
}
