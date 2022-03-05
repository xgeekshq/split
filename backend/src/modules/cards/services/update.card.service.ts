import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CARD_NOT_INSERTED,
  CARD_NOT_REMOVED,
} from '../../../libs/exceptions/messages';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { UpdateCardService } from '../interfaces/services/update.card.service.interface';
import { TYPES } from '../interfaces/types';
import { pullCard } from '../shared/pull.card';
import { pushCardIntoPosition } from '../shared/push.card';

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
    const session = await this.boardModel.db.startSession();
    session.startTransaction();
    try {
      const cardToMove = await this.cardService.getCardFromBoard(
        boardId,
        cardId,
      );
      if (!cardToMove) return null;
      const pullResult = await pullCard(
        boardId,
        cardId,
        this.boardModel,
        session,
      );
      if (pullResult.modifiedCount !== 1) throw Error(CARD_NOT_REMOVED);

      const pushResult = await pushCardIntoPosition(
        boardId,
        targetColumnId,
        newPosition,
        cardToMove,
        this.boardModel,
        session,
      );
      if (!pushResult) throw Error(CARD_NOT_INSERTED);

      await session.commitTransaction();
      return pushResult;
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return null;
  }

  updateCardText(
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
      .lean()
      .exec();
  }

  updateCardGroupText(
    boardId: string,
    cardId: string,
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
            'columns.$.cards.$[c].text': text,
          },
        },
        {
          arrayFilters: [{ 'c._id': cardId, 'c.createdBy': userId }],
          new: true,
        },
      )
      .lean()
      .exec();
  }
}
