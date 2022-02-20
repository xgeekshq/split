import { Inject, Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteCardApplication } from '../interfaces/applications/delete.card.application.interface';
import { DeleteCardService } from '../interfaces/services/delete.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteCardApplicationImpl implements DeleteCardApplication {
  constructor(
    @Inject(TYPES.services.DeleteCardService)
    private deleteCardService: DeleteCardService,
  ) {}

  delete(
    boardId: string,
    cardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null> {
    return this.deleteCardService.delete(boardId, cardId, userId);
  }
}
