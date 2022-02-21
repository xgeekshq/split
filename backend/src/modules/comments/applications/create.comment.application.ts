import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentApplication } from '../interfaces/applications/create.comment.application.interface';
import { CreateCommentService } from '../interfaces/services/create.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateCommentApplicationImpl implements CreateCommentApplication {
  constructor(
    @Inject(TYPES.services.CreateCommentService)
    private createCommentService: CreateCommentService,
  ) {}

  createItemComment(
    boardId: string,
    cardId: string,
    itemId: string,
    userId: string,
    text: string,
  ) {
    return this.createCommentService.createItemComment(
      boardId,
      cardId,
      itemId,
      userId,
      text,
    );
  }
}
