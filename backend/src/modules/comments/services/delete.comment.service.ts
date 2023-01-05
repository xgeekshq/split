import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';

@Injectable()
export default class DeleteCommentServiceImpl implements DeleteCommentService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<UpdateResult> {
		return this.boardModel
			.updateOne(
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
				}
			)
			.lean()
			.exec();
	}

	deleteCardGroupComment(
		boardId: string,
		commentId: string,
		userId: string
	): Promise<UpdateResult> {
		return this.boardModel
			.updateOne(
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
				}
			)
			.lean()
			.exec();
	}
}
