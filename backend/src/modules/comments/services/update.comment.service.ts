import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';
import { UpdateCommentService } from '../interfaces/services/update.comment.service.interface';

@Injectable()
export default class UpdateCommentService implements UpdateCommentService {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		userId: string,
		text: string,
		anonymous: boolean
	) {
		return this.boardModel
			.findOneAndUpdate(
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
				}
			)
			.populate(BoardDataPopulate)
			.lean()
			.exec();
	}

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		userId: string,
		text: string,
		anonymous: boolean
	) {
		return this.boardModel
			.findOneAndUpdate(
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
				}
			)
			.populate(BoardDataPopulate)
			.lean()
			.exec();
	}
}
