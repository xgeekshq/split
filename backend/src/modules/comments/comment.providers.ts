import { DeleteCommentUseCase } from 'src/modules/comments/applications/delete-comment.use-case';
import {
	COMMENT_REPOSITORY,
	CREATE_COMMENT_USE_CASE,
	DELETE_COMMENT_USE_CASE,
	UPDATE_COMMENT_USE_CASE
} from './constants';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentUseCase } from 'src/modules/comments/applications/create-comment.use-case';
import { UpdateCommentUseCase } from 'src/modules/comments/applications/update-comment.use-case';

/* USE CASES */

export const createCommentUseCase = {
	provide: CREATE_COMMENT_USE_CASE,
	useClass: CreateCommentUseCase
};

export const deleteCommentUseCase = {
	provide: DELETE_COMMENT_USE_CASE,
	useClass: DeleteCommentUseCase
};

export const updateCommentUseCase = {
	provide: UPDATE_COMMENT_USE_CASE,
	useClass: UpdateCommentUseCase
};

/* REPOSITORY */

export const commentRepository = {
	provide: COMMENT_REPOSITORY,
	useClass: CommentRepository
};
