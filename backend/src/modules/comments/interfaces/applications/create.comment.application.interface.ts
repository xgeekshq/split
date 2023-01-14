import Comment from '../../schemas/comment.schema';

export interface CreateCommentApplication {
	createItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	): Promise<{
		newComment: Comment;
		hideCards: boolean;
	}>;

	createCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	): Promise<{
		newComment: Comment;
		hideCards: boolean;
	}>;
}
