import { Inject, Injectable } from '@nestjs/common';
import { DeleteCommentApplicationInterface } from '../interfaces/applications/delete.comment.application.interface';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteCommentApplicationInterfaceImpl implements DeleteCommentApplicationInterface {
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
