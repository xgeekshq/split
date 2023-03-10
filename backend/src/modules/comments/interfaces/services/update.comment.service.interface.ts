import Board from 'src/modules/boards/entities/board.schema';

export interface UpdateCommentServiceInterface {
	updateItemComment(
		boardId: string,
		cardId: string,
		cardItemId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<Board>;

	updateCardGroupComment(
		boardId: string,
		cardId: string,
		commentId: string,
		text: string,
		anonymous: boolean
	): Promise<Board>;
}
