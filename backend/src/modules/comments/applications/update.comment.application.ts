import { Inject, Injectable } from '@nestjs/common';
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
  ) {
    return this.updateCommentService.updateItemComment(
      boardId,
      cardId,
      cardItemId,
      commentId,
      userId,
      text,
    );
  }

  updateCardGroupComment(
    boardId: string,
    cardId: string,
    commentId: string,
    userId: string,
    text: string,
  ) {
    return this.updateCommentService.updateCardGroupComment(
      boardId,
      cardId,
      commentId,
      userId,
      text,
    );
  }
}
