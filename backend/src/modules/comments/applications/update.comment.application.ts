import { Inject, Injectable } from '@nestjs/common';
import { UpdateCommentApplicationInterface } from '../interfaces/applications/update.comment.application.interface';
import { UpdateCommentServiceInterface } from '../interfaces/services/update.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateCommentApplication implements UpdateCommentApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateCommentService)
		private updateCommentService: UpdateCommentServiceInterface
	) {}

	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	) {
		return this.updateCommentService.updateItemComment(
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
		return this.updateCommentService.updateCardGroupComment(
			boardId,
			cardId,
			commentId,
			text,
			anonymous
		);
	}
}
