import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { UpdateCommentService } from '../interfaces/services/update.comment.service.interface';

@Injectable()
export default class UpdateCommentServiceImpl implements UpdateCommentService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		userId: string,
		text: string
	) {
		return this.boardModel
			.findOneAndUpdate(
				{
					_id: boardId,
					'columns.cards.items.comments._id': commentId,
					'columns.cards.items.comments.createdBy': userId
				},
				{
					$set: {
						'columns.$.cards.$[c].items.$[i].comments.$[com].text': text
					}
				},
				{
					arrayFilters: [
						{ 'c._id': cardId },
						{ 'i._id': cardItemId },
						{ 'com._id': commentId, 'com.createdBy': userId }
					],
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

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		userId: string,
		text: string
	) {
		return this.boardModel
			.findOneAndUpdate(
				{
					_id: boardId,
					'columns.cards.comments._id': commentId
				},
				{
					$set: {
						'columns.$.cards.$[c].comments.$[com].text': text
					}
				},
				{
					arrayFilters: [{ 'c._id': cardId }, { 'com._id': commentId, 'com.createdBy': userId }],
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
