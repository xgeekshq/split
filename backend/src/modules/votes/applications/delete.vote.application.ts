import { Inject, Injectable } from '@nestjs/common';
import { DeleteVoteApplication } from '../interfaces/applications/delete.vote.application.interface';
import { DeleteVoteService } from '../interfaces/services/delete.vote.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteVoteApplicationImpl implements DeleteVoteApplication {
  constructor(
    @Inject(TYPES.services.DeleteVoteService)
    private deleteVoteService: DeleteVoteService,
  ) {}

  deleteVoteFromCard(
    boardId: string,
    cardId: string,
    userId: string,
    cardItemId: string,
  ) {
    return this.deleteVoteService.deleteVoteFromCard(
      boardId,
      cardId,
      userId,
      cardItemId,
    );
  }

  deleteVoteFromCardGroup(boardId: string, cardId: string, userId: string) {
    return this.deleteVoteService.deleteVoteFromCardGroup(
      boardId,
      cardId,
      userId,
    );
  }
}
