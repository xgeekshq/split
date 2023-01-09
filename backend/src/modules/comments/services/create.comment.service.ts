import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { CreateCommentService } from '../interfaces/services/create.comment.service.interface';

@Injectable()
export default class CreateCommentServiceImpl implements CreateCommentService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	createItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean
	) {
		return this.boardModel
			.findOneAndUpdate(
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
				}
			)
			.populate({
				path: 'users',
				select: 'user role -board votesCount',
				populate: { path: 'user', select: 'firstName email lastName _id' }
			})
			.populate({
				path: 'team',
				select: 'name users -_id',
				populate: {
					path: 'users',
					select: 'user role',
					populate: { path: 'user', select: 'firstName lastName email joinedAt' }
				}
			})
			.populate({
				path: 'columns.cards.createdBy',
				select: '_id firstName lastName'
			})
			.populate({
				path: 'columns.cards.comments.createdBy',
				select: '_id  firstName lastName'
			})
			.populate({
				path: 'columns.cards.items.createdBy',
				select: '_id firstName lastName'
			})
			.populate({
				path: 'columns.cards.items.comments.createdBy',
				select: '_id firstName lastName'
			})
			.populate({
				path: 'createdBy',
				select: '_id firstName lastName isSAdmin joinedAt'
			})
			.populate({
				path: 'dividedBoards',
				select: '-__v -createdAt -id',
				populate: {
					path: 'users',
					select: 'role user'
				}
			})
			.lean()
			.exec();
	}

	createCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean
	) {
		return this.boardModel
			.findOneAndUpdate(
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
				}
			)
			.populate({
				path: 'users',
				select: 'user role -board votesCount',
				populate: { path: 'user', select: 'firstName email lastName _id' }
			})
			.populate({
				path: 'team',
				select: 'name users -_id',
				populate: {
					path: 'users',
					select: 'user role',
					populate: { path: 'user', select: 'firstName lastName email joinedAt' }
				}
			})
			.populate({
				path: 'columns.cards.createdBy',
				select: '_id firstName lastName'
			})
			.populate({
				path: 'columns.cards.comments.createdBy',
				select: '_id  firstName lastName'
			})
			.populate({
				path: 'columns.cards.items.createdBy',
				select: '_id firstName lastName'
			})
			.populate({
				path: 'columns.cards.items.comments.createdBy',
				select: '_id firstName lastName'
			})
			.populate({
				path: 'createdBy',
				select: '_id firstName lastName isSAdmin joinedAt'
			})
			.populate({
				path: 'dividedBoards',
				select: '-__v -createdAt -id',
				populate: {
					path: 'users',
					select: 'role user'
				}
			})
			.lean()
			.exec();
	}
}
