import { Inject, Injectable } from '@nestjs/common';
import { BoardDocument } from 'src/modules/boards/schemas/board.schema';
import CardDto from '../dto/card.dto';
import { CreateCardApplication } from '../interfaces/applications/create.card.application.interface';
import { CreateCardService } from '../interfaces/services/create.card.service.interface';
import { TYPES } from '../interfaces/type';

@Injectable()
export class CreateCardApplicationImpl implements CreateCardApplication {
  constructor(
    @Inject(TYPES.services.CreateCardService)
    private createCardService: CreateCardService,
  ) {}

  create(
    cardId: number,
    userId: string,
    card: CardDto,
    colIdToAdd: string,
  ): Promise<BoardDocument> {
    return this.createCardService.create(cardId, userId, card, colIdToAdd);
  }
}
