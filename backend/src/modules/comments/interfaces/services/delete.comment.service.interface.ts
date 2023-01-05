import { UpdateResult } from 'mongodb';

export interface DeleteCommentService {
	deleteItemComment(boardId: string, commentId: string, userId: string): Promise<UpdateResult>;

	deleteCardGroupComment(boardId: string, commentId: string, userId: string): Promise<UpdateResult>;
}
