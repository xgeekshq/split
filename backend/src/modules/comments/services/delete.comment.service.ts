import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';

@Injectable()
export default class DeleteCommentService implements DeleteCommentService {
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
			.populate(BoardDataPopulate)
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
			.populate(BoardDataPopulate)
			.lean()
			.exec();
	}
}
