import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { COMMENT_REPOSITORY } from '../constants';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/repositories/comment.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';
import UpdateCommentUseCaseDto from 'src/modules/comments/dto/useCase/update-comment.use-case.dto';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';

@Injectable()
export class UpdateCommentUseCase implements UseCase<UpdateCommentUseCaseDto, void> {
	constructor(
		@Inject(COMMENT_REPOSITORY)
		private readonly commentRepository: CommentRepositoryInterface
	) {}

	async execute({
		boardId,
		cardId,
		cardItemId,
		isCardGroup,
		commentId,
		anonymous,
		text,
		completionHandler
	}: UpdateCommentUseCaseDto) {
		let updatedBoard;

		if (isCardGroup) {
			updatedBoard = await this.updateCardGroupComment(boardId, cardId, commentId, text, anonymous);
		} else {
			updatedBoard = await this.updateItemComment(
				boardId,
				cardId,
				cardItemId,
				commentId,
				text,
				anonymous
			);
		}

		if (!updatedBoard) {
			throw new UpdateFailedException();
		}

		completionHandler();

		return;
	}

	private updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<Board> {
		return this.commentRepository.updateItemComment(
			boardId,
			cardId,
			cardItemId,
			commentId,
			text,
			anonymous
		);
	}

	private updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<Board> {
		return this.commentRepository.updateCardGroupComment(
			boardId,
			cardId,
			commentId,
			text,
			anonymous
		);
	}
}
