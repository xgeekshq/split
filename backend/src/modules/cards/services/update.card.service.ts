import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { UpdateCardService } from '../interfaces/services/update.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class UpdateCardServiceImpl implements UpdateCardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(TYPES.services.GetCardService)
    private readonly cardService: GetCardService,
  ) {}

  async updateCardPosition(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    newPosition: number,
  ) {
    const cardToMove = await this.cardService.getCardFromBoard(boardId, cardId);
    if (cardToMove) {
      const pullResult = await this.boardModel
        .updateOne(
          {
            _id: boardId,
            'columns.cards._id': cardId,
          },
          {
            $pull: {
              'columns.$[].cards': { _id: cardId },
            },
          },
        )
        .lean();

      if (pullResult.modifiedCount !== 1) {
        return null;
      }

      return this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns._id': targetColumnId,
          },
          {
            $push: {
              'columns.$.cards': {
                $each: [cardToMove],
                $position: newPosition,
              },
            },
          },
          { new: true },
        )
        .lean();
    }
    return null;
  }

  async updateCardText(
    boardId: string,
    cardId: string,
    cardItemId: string,
    userId: string,
    text: string,
  ) {
    return this.boardModel
      .findOneAndUpdate(
        {
          _id: boardId,
          'columns.cards._id': cardId,
        },
        {
          $set: {
            'columns.$.cards.$[card].text': text,
            'columns.$.cards.$[card].items.$[item].text': text,
          },
        },
        {
          arrayFilters: [
            { 'card._id': cardId },
            { 'item._id': cardItemId, 'item.createdBy': userId },
          ],
          new: true,
        },
      )
      .lean();
  }
}
