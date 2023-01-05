import { UpdateResult } from 'mongodb';

export interface DeleteCommentApplication {
	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<UpdateResult>;

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<UpdateResult>;
}
