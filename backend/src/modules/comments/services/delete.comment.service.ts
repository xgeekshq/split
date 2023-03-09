import { Inject, Injectable } from '@nestjs/common';
import { DeleteCommentServiceInterface } from '../interfaces/services/delete.comment.service.interface';
import { CommentRepositoryInterface } from '../interfaces/repositories/comment.repository.interface';
import { TYPES } from '../interfaces/types';
import Board from 'src/modules/boards/entities/board.schema';

@Injectable()
export default class DeleteCommentService implements DeleteCommentServiceInterface {
	constructor(
		@Inject(TYPES.repositories.CommentRepository)
		private commentRepository: CommentRepositoryInterface
	) {}

	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<Board> {
		return this.commentRepository.deleteItemComment(boardId, commentId, userId);
	}

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<Board> {
		return this.commentRepository.deleteItemComment(boardId, commentId, userId);
	}
}
