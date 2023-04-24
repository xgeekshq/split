import { CommentRepositoryInterface } from '../interfaces/repositories/comment.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from 'src/libs/repositories/mongo/mongo-generic.repository';
import Board from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';

@Injectable()
export class CommentRepository
	extends MongoGenericRepository<Board>
	implements CommentRepositoryInterface
{
	constructor(@InjectModel(Board.name) private model: Model<Board>) {
		super(model);
	}

	/* CREATE COMMENTS*/

	insertItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.items._id': itemId
			},
			{
				$push: {
					'columns.$.cards.$[c].items.$[i].comments': {
						text,
						createdBy: userId,
						anonymous,
						createdAt: new Date()
					}
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }, { 'i._id': itemId }],
				new: true
			},
			BoardDataPopulate
		);
	}

	insertCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards._id': cardId
			},
			{
				$push: {
					'columns.$.cards.$[c].comments': {
						text,
						createdBy: userId,
						anonymous,
						createdAt: new Date()
					}
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }],
				new: true
			},
			BoardDataPopulate
		);
	}

	/* UPDATE COMMENTS */

	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.items.comments._id': commentId
			},
			{
				$set: {
					'columns.$.cards.$[c].items.$[i].comments.$[com].text': text,
					'columns.$.cards.$[c].items.$[i].comments.$[com].anonymous': anonymous
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }, { 'com._id': commentId }],
				new: true
			},
			BoardDataPopulate
		);
	}

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.comments._id': commentId
			},
			{
				$set: {
					'columns.$.cards.$[c].comments.$[com].text': text,
					'columns.$.cards.$[c].comments.$[com].anonymous': anonymous
				}
			},
			{
				arrayFilters: [{ 'c._id': cardId }, { 'com._id': commentId }],
				new: true
			},
			BoardDataPopulate
		);
	}

	/* DELETE COMMENTS */

	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.items.comments._id': commentId,
				'columns.cards.items.comments.createdBy': userId
			},
			{
				$pull: {
					'columns.$[].cards.$[].items.$[].comments': {
						_id: commentId,
						createdBy: userId
					}
				}
			},
			{ new: true },
			BoardDataPopulate
		);
	}

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<Board> {
		return this.findOneByFieldAndUpdate(
			{
				_id: boardId,
				'columns.cards.comments._id': commentId
			},
			{
				$pull: {
					'columns.$[].cards.$[].comments': {
						_id: commentId,
						createdBy: userId
					}
				}
			},
			{ new: true },
			BoardDataPopulate
		);
	}
}
