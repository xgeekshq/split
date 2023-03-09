import { Inject, Injectable } from '@nestjs/common';
import { DeleteCommentApplicationInterface } from '../interfaces/applications/delete.comment.application.interface';
import { TYPES } from '../interfaces/types';
import DeleteCommentService from '../services/delete.comment.service';

@Injectable()
export class DeleteCommentApplication implements DeleteCommentApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteCommentService)
		private deleteCommentService: DeleteCommentService
	) {}

	deleteItemComment(boardId: string, commentId: string, userId: string) {
		return this.deleteCommentService.deleteItemComment(boardId, commentId, userId);
	}

	deleteCardGroupComment(boardId: string, commentId: string, userId: string) {
		return this.deleteCommentService.deleteCardGroupComment(boardId, commentId, userId);
	}
}
