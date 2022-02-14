import { Inject, Injectable } from '@nestjs/common';
import { BoardDocument } from '../../boards/schemas/board.schema';
import { UpdateCommentApplication } from '../interfaces/applications/update.comment.application.interface';
import { UpdateCommentService } from '../interfaces/services/update.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateCommentApplicationImpl implements UpdateCommentApplication {
  constructor(
    @Inject(TYPES.services.UpdateCommentService)
    private updateCommentService: UpdateCommentService,
  ) {}

  updateItemComment(
    boardId: string,
    cardId: string,
    cardItemId: string,
    commentId: string,
    userId: string,
    text: string,
  ): Promise<BoardDocument> {
    return this.updateCommentService.updateItemComment(
      boardId,
      cardId,
      cardItemId,
      commentId,
      userId,
      text,
    );
  }
}
