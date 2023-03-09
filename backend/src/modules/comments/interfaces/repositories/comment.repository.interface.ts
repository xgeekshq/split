import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';

export interface CommentRepositoryInterface extends BaseInterfaceRepository<Board> {
	// CREATE COMMENTS
	insertItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<Board>;

	insertCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean
	): Promise<Board>;

	// UPDATE COMMENTS
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

	// DELETE COMMENTS
	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<Board>;

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<Board>;
}
