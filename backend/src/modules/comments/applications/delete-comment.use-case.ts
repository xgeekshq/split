import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { COMMENT_REPOSITORY } from '../constants';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/repositories/comment.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';
import DeleteCommentUseCaseDto from 'src/modules/comments/dto/useCase/delete-comment.use-case.dto';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';

@Injectable()
export class DeleteCommentUseCase implements UseCase<DeleteCommentUseCaseDto, void> {
	constructor(
		@Inject(COMMENT_REPOSITORY)
		private readonly commentRepository: CommentRepositoryInterface
	) {}

	async execute(commentData: DeleteCommentUseCaseDto) {
		const { boardId, commentId, userId, isCardGroup, completionHandler } = commentData;
		let board;

		if (isCardGroup) {
			board = await this.deleteCardGroupComment(boardId, commentId, userId);
		} else {
			board = await this.deleteItemComment(boardId, commentId, userId);
		}

		if (!board) {
			throw new DeleteFailedException();
		}

		completionHandler();

		return;
	}

	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<Board> {
		return this.commentRepository.deleteItemComment(boardId, commentId, userId);
	}

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<Board> {
		return this.commentRepository.deleteCardGroupComment(boardId, commentId, userId);
	}
}
