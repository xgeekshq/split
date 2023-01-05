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
			.lean()
			.exec();
	}
}
