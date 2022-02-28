import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { UnmergeCardService } from '../interfaces/services/unmerge.card.service.interface';
import { TYPES } from '../interfaces/types';
import { pullItem } from '../shared/pull.card';
import { pushCardIntoPosition } from '../shared/push.card';

export class UnmergeCardServiceImpl implements UnmergeCardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(TYPES.services.GetCardService)
    private readonly cardService: GetCardService,
  ) {}

  async unmergeAndUpdatePosition(
    boardId: string,
    cardGroupId: string,
    draggedCardId: string,
    columnId: string,
    position: number,
  ) {
    const session = await this.boardModel.db.startSession();
    session.startTransaction();
    try {
      const cardItemToMove = await this.cardService.getCardItemFromGroup(
        boardId,
        draggedCardId,
      );

      if (!cardItemToMove) return null;
      const pullResult = await pullItem(
        boardId,
        draggedCardId,
        this.boardModel,
        session,
      );
      if (pullResult.modifiedCount !== 1) throw Error();

      const cardGroup = await this.cardService.getCardFromBoard(
        boardId,
        cardGroupId,
      );
      if (!cardGroup) throw Error();

      const { text, comments, votes: itemVotes } = cardGroup.items[0];
      const newComments = cardGroup.comments.concat(comments);
      const newVotes = (cardGroup.votes as unknown as string[]).concat(
        itemVotes as unknown as string[],
      );

      if (cardGroup.items.length === 1) {
        const updateResult = await this.boardModel
          .updateOne(
            {
              _id: boardId,
              'columns.cards._id': cardGroupId,
            },
            {
              $set: {
                'columns.$.cards.$[c].text': text,
                'columns.$.cards.$[c].comments': [],
                'columns.$.cards.$[c].votes': [],
                'columns.$.cards.$[c].items.0.comments': newComments,
                'columns.$.cards.$[c].items.0.votes': newVotes,
              },
            },
            {
              arrayFilters: [{ 'c._id': cardGroupId }],
              session,
            },
          )
          .lean()
          .exec();

        if (updateResult.modifiedCount !== 1) throw Error();
      }

      const newCardItem = { ...cardItemToMove };
      delete newCardItem._id;

      const newCard = {
        ...cardItemToMove,
        comments: [],
        votes: [],
        items: [{ ...newCardItem }],
      };

      const pushResult = await pushCardIntoPosition(
        boardId,
        columnId,
        position,
        newCard,
        this.boardModel,
        session,
      );
      if (!pushResult) throw Error();
      await session.commitTransaction();
      return pushResult;
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return null;
  }
}
