import { UpdateCommentServiceInterface } from './../interfaces/services/update.comment.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CommentRepositoryInterface } from '../interfaces/repositories/comment.repository.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class UpdateCommentService implements UpdateCommentServiceInterface {
	constructor(
		@Inject(TYPES.repositories.CommentRepository)
		private commentRepository: CommentRepositoryInterface
	) {}

	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	) {
		return this.commentRepository.updateItemComment(
			boardId,
			cardId,
			cardItemId,
			commentId,
			text,
			anonymous
		);
	}

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	) {
		return this.commentRepository.updateCardGroupComment(
			boardId,
			cardId,
			commentId,
			text,
			anonymous
		);
	}
}
