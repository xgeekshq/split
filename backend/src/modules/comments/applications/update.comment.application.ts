import { CommentRepositoryInterface } from './../interfaces/repositories/comment-board.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateCommentApplicationInterface } from '../interfaces/applications/update.comment.application.interface';
import { UpdateCommentService } from '../interfaces/services/update.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateCommentApplication implements UpdateCommentApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateCommentService)
		private updateCommentService: UpdateCommentService,
		@Inject(TYPES.repositories.CommentRepository)
		private commentRepository: CommentRepositoryInterface
	) {}

	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		userId: string,
		text: string,
		anonymous: boolean
	) {
		return this.updateCommentService.updateItemComment(
			boardId,
			cardId,
			cardItemId,
			commentId,
			userId,
			text,
			anonymous
		);
	}

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		userId: string,
		text: string,
		anonymous: boolean
	) {
		return this.updateCommentService.updateCardGroupComment(
			boardId,
			cardId,
			commentId,
			userId,
			text,
			anonymous
		);
	}
}
