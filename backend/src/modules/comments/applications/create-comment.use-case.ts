import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { COMMENT_REPOSITORY } from '../constants';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/repositories/comment.repository.interface';
import { replaceComments } from 'src/modules/boards/utils/clean-board';
import { hideText } from 'src/libs/utils/hideText';
import CreateCommentDto from 'src/modules/comments/dto/create.comment.dto';
import Comment from 'src/modules/comments/entities/comment.schema';
import CreateCommentUseCaseDto from 'src/modules/comments/dto/useCase/create-comment.use-case.dto';
import User from 'src/modules/users/entities/user.schema';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import Column from 'src/modules/columns/entities/column.schema';

type HideCommentsType = {
	hideCards: boolean;
	user: User;
	comment: Comment;
	anonymous: boolean;
	boardId: string;
	cardId: string;
	columnId: string;
	isCardGroup: boolean;
	socketId: string;
	text: string;
	completionHandler: (createCommentData: CreateCommentDto) => void;
	cardItemId?: string;
};

@Injectable()
export class CreateCommentUseCase implements UseCase<CreateCommentUseCaseDto, Comment> {
	constructor(
		@Inject(COMMENT_REPOSITORY)
		private readonly commentRepository: CommentRepositoryInterface
	) {}

	async execute({
		boardId,
		cardId,
		cardItemId,
		user,
		text,
		anonymous,
		columnId,
		completionHandler,
		socketId
	}: CreateCommentUseCaseDto): Promise<Comment> {
		if (cardItemId) {
			return await this.createItemComment({
				boardId,
				cardId,
				cardItemId,
				user,
				text,
				anonymous,
				columnId,
				completionHandler,
				socketId
			});
		} else {
			return await this.createCardGroupComment({
				boardId,
				cardId,
				user,
				text,
				anonymous,
				columnId,
				completionHandler,
				socketId
			});
		}
	}

	private async createItemComment({
		boardId,
		cardId,
		cardItemId,
		user,
		text,
		anonymous,
		columnId,
		completionHandler,
		socketId
	}: CreateCommentUseCaseDto): Promise<Comment> {
		const userId = String(user._id);

		const updatedBoard = await this.commentRepository.insertItemComment(
			boardId,
			cardId,
			cardItemId,
			userId,
			text,
			anonymous
		);

		if (!updatedBoard) throw new InsertFailedException();

		const { colIdx, cardIdx } = this.findColumnAndCardIndex(updatedBoard.columns, columnId, cardId);

		const cardItemIdx = updatedBoard.columns[colIdx].cards[cardIdx].items.findIndex(
			(item) => item._id.toString() === cardItemId
		);

		const newComment =
			updatedBoard.columns[colIdx].cards[cardIdx].items[cardItemIdx].comments[
				updatedBoard.columns[colIdx].cards[cardIdx].items[cardItemIdx].comments.length - 1
			];

		this.replaceCommentsAndCallCompletionHandler({
			hideCards: updatedBoard.hideCards,
			user,
			comment: newComment,
			anonymous,
			boardId,
			cardId,
			columnId,
			isCardGroup: false,
			socketId,
			text,
			completionHandler,
			cardItemId
		});

		return newComment;
	}

	private async createCardGroupComment({
		boardId,
		cardId,
		user,
		text,
		anonymous,
		columnId,
		completionHandler,
		socketId
	}: CreateCommentUseCaseDto) {
		const userId = String(user._id);

		const updatedBoard = await this.commentRepository.insertCardGroupComment(
			boardId,
			cardId,
			userId,
			text,
			anonymous
		);

		if (!updatedBoard) throw new InsertFailedException();

		const { colIdx, cardIdx } = this.findColumnAndCardIndex(updatedBoard.columns, columnId, cardId);

		const newComment =
			updatedBoard.columns[colIdx].cards[cardIdx].comments[
				updatedBoard.columns[colIdx].cards[cardIdx].comments.length - 1
			];

		this.replaceCommentsAndCallCompletionHandler({
			hideCards: updatedBoard.hideCards,
			user,
			comment: newComment,
			anonymous,
			boardId,
			cardId,
			columnId,
			isCardGroup: true,
			socketId,
			text,
			completionHandler
		});

		return newComment;
	}

	private replaceCommentsAndCallCompletionHandler({
		hideCards,
		user,
		comment,
		anonymous,
		boardId,
		cardId,
		columnId,
		isCardGroup,
		socketId,
		text,
		completionHandler,
		cardItemId
	}: HideCommentsType) {
		const userId = String(user._id);

		const commentWithHiddenInfo = replaceComments(hideCards, user, [comment], hideText(userId));

		const commentData: CreateCommentDto = {
			anonymous,
			boardId,
			cardId,
			cardItemId,
			columnId,
			isCardGroup,
			newComment: commentWithHiddenInfo[0],
			socketId,
			text
		};

		completionHandler(commentData);
	}

	private findColumnAndCardIndex(columns: Column[], columnId: string, cardId: string) {
		const colIdx = columns.findIndex((col) => col._id.toString() === columnId);
		const cardIdx = columns[colIdx].cards.findIndex((card) => card._id.toString() === cardId);

		return {
			colIdx,
			cardIdx
		};
	}
}
