import { CommentRepositoryInterface } from '../interfaces/repositories/comment.repository.interface';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateCommentServiceInterface } from '../interfaces/services/create.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class CreateCommentService implements CreateCommentServiceInterface {
	constructor(
		@Inject(TYPES.repositories.CommentRepository)
		private commentRepository: CommentRepositoryInterface
	) {}

	async createItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	) {
		const updatedBoard = await this.commentRepository.insertItemComment(
			boardId,
			cardId,
			itemId,
			userId,
			text,
			anonymous
		);

		if (!updatedBoard) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIdx = updatedBoard.columns.findIndex((col) => col._id.toString() === columnId);
		const cardIdx = updatedBoard.columns[colIdx].cards.findIndex(
			(card) => card._id.toString() === cardId
		);
		const cardItemIdx = updatedBoard.columns[colIdx].cards[cardIdx].items.findIndex(
			(item) => item._id.toString() === itemId
		);

		return {
			newComment:
				updatedBoard.columns[colIdx].cards[cardIdx].items[cardItemIdx].comments[
					updatedBoard.columns[colIdx].cards[cardIdx].items[cardItemIdx].comments.length - 1
				],
			hideCards: updatedBoard.hideCards
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
		const updatedBoard = await this.commentRepository.insertCardGroupComment(
			boardId,
			cardId,
			userId,
			text,
			anonymous
		);

		if (!updatedBoard) throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);

		const colIdx = updatedBoard.columns.findIndex((col) => col._id.toString() === columnId);
		const cardIdx = updatedBoard.columns[colIdx].cards.findIndex(
			(card) => card._id.toString() === cardId
		);

		return {
			newComment:
				updatedBoard.columns[colIdx].cards[cardIdx].comments[
					updatedBoard.columns[colIdx].cards[cardIdx].comments.length - 1
				],
			hideCards: updatedBoard.hideCards
		};
	}
}
