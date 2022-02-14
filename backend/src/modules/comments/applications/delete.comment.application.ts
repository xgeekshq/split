import { Inject, Injectable } from '@nestjs/common';
import { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteCommentApplication } from '../interfaces/applications/delete.comment.application.interface';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteCommentApplicationImpl implements DeleteCommentApplication {
  constructor(
    @Inject(TYPES.services.DeleteCommentService)
    private deleteCommentService: DeleteCommentService,
  ) {}

  deleteItemComment(
    boardId: string,
    commentId: string,
    userId: string,
  ): Promise<BoardDocument> {
    return this.deleteCommentService.deleteItemComment(
      boardId,
      commentId,
      userId,
    );
  }
}
