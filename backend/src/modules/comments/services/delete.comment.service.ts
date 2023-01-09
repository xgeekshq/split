import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';

@Injectable()
export default class DeleteCommentServiceImpl implements DeleteCommentService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	deleteItemComment(boardId: string, commentId: string, userId: string) {
		return this.boardModel
			.findOneAndUpdate(
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
				{ new: true }
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

	deleteCardGroupComment(boardId: string, commentId: string, userId: string) {
		return this.boardModel
			.findOneAndUpdate(
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
				{ new: true }
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
