import Board from 'src/modules/boards/entities/board.schema';

export interface DeleteCommentServiceInterface {
	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<Board>;

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<Board>;
}
