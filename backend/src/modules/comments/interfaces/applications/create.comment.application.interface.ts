import Comment from 'src/modules/comments/schemas/comment.schema';

export interface CreateCommentApplicationInterface {
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
