import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import { BoardDataPopulate } from 'src/modules/boards/utils/populate-board';
import { CreateCommentServiceInterface } from '../interfaces/services/create.comment.service.interface';

@Injectable()
export default class CreateCommentServiceImpl implements CreateCommentServiceInterface {
	constructor(@InjectModel(Board.name) private boardModel: Model<BoardDocument>) {}

	async createItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	) {
		const board = await this.boardModel
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
			.populate(BoardDataPopulate)
			.lean()
			.exec();

		if (!board) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIdx = board.columns.findIndex((col) => col._id.toString() === columnId);
		const cardIdx = board.columns[colIdx].cards.findIndex((card) => card._id.toString() === cardId);
		const cardItemIdx = board.columns[colIdx].cards[cardIdx].items.findIndex(
			(item) => item._id.toString() === itemId
		);

		return {
			newComment:
				board.columns[colIdx].cards[cardIdx].items[cardItemIdx].comments[
					board.columns[colIdx].cards[cardIdx].items[cardItemIdx].comments.length - 1
				],
			hideCards: board.hideCards
		};
	}

	async createCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	) {
		const board = await this.boardModel
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
			.populate(BoardDataPopulate)
			.lean()
			.exec();

		if (!board) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIdx = board.columns.findIndex((col) => col._id.toString() === columnId);
		const cardIdx = board.columns[colIdx].cards.findIndex((card) => card._id.toString() === cardId);

		return {
			newComment:
				board.columns[colIdx].cards[cardIdx].comments[
					board.columns[colIdx].cards[cardIdx].comments.length - 1
				],
			hideCards: board.hideCards
		};
	}
}
