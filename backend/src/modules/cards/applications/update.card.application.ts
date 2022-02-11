import { Inject, Injectable } from '@nestjs/common';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import { UpdateCardApplication } from '../interfaces/applications/update.card.application.interface';
import { UpdateCardService } from '../interfaces/services/update.card.service.interface';
import { TYPES } from '../interfaces/type';

@Injectable()
export class UpdateCardApplicationImpl implements UpdateCardApplication {
  constructor(
    @Inject(TYPES.services.UpdateCardService)
    private updateCardService: UpdateCardService,
  ) {}

  updateCardPosition(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    newPosition: number,
  ): Promise<BoardDocument> {
    return this.updateCardService.updateCardPosition(
      boardId,
      cardId,
      targetColumnId,
      newPosition,
    );
  }

  updateCardText(
    boardId: string,
    cardId: string,
    cardItemId: string,
    userId: string,
    text: string,
  ): Promise<BoardDocument> {
    return this.updateCardService.updateCardText(
      boardId,
      cardId,
      cardItemId,
      userId,
      text,
    );
  }
}
