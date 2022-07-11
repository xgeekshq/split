import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, ObjectId, LeanDocument } from 'mongoose';
import { TYPES } from '../interfaces/types';
import * as Votes from '../../votes/interfaces/types';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteCardService } from '../interfaces/services/delete.card.service.interface';
import { GetCardService } from '../interfaces/services/get.card.service.interface';
import { DeleteVoteService } from '../../votes/interfaces/services/delete.vote.service.interface';
import { UPDATE_FAILED } from '../../../libs/exceptions/messages';
import User from '../../users/schemas/user.schema';
import { CommentDocument } from '../../comments/schemas/comment.schema';
import { CardItemDocument } from '../schemas/card.item.schema';

@Injectable()
export default class DeleteCardServiceImpl implements DeleteCardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(TYPES.services.GetCardService)
    private getCardService: GetCardService,
    @Inject(Votes.TYPES.services.DeleteVoteService)
    private deleteVoteService: DeleteVoteService,
  ) {}

  async countDeletedVotes(
    boardId: string,
    cardId: string,
    userId: string,
    session: ClientSession,
    cardItemId?: string,
  ) {
    const getCard = !cardItemId
      ? await this.getCardService.getCardFromBoard(boardId, cardId)
      : await this.getCardService.getCardItemFromGroup(boardId, cardItemId);
    const countVotes = getCard?.votes?.length ?? 0;
    if (getCard && countVotes) {
      for (
        let indexVotes = 0;
        indexVotes < getCard?.votes.length;
        indexVotes++
      ) {
        const boardUser = this.deleteVoteService.decrementVoteUser(
          boardId,
          getCard.votes[indexVotes].valueOf().toString(),
          session,
        );
        if (!boardUser) throw Error(UPDATE_FAILED);
      }
    }
    if (getCard?.items) {
      for (
        let indexItems = 0;
        indexItems < getCard?.items.length;
        indexItems++
      ) {
        for (
          let indexVotes = 0;
          indexVotes < getCard.items[indexItems].votes.length;
          indexVotes++
        ) {
          const boardUser = this.deleteVoteService.decrementVoteUser(
            boardId,
            getCard.items[indexItems].votes[indexVotes].valueOf().toString(),
            session,
          );
          if (!boardUser) throw Error(UPDATE_FAILED);
        }
      }
    }
  }

  async delete(boardId: string, cardId: string, userId: string) {
    const session = await this.boardModel.db.startSession();
    session.startTransaction();
    try {
      await this.countDeletedVotes(boardId, cardId, userId, session);
      const board = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards._id': cardId,
          },
          {
            $pull: {
              'columns.$[].cards': { _id: cardId, createdBy: userId },
            },
          },
          { new: true },
        )
        .lean()
        .exec();
      if (!board) throw Error(UPDATE_FAILED);
      await session.commitTransaction();
      return board;
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return null;
  }

  async refactorLastItem(
    boardId: string,
    cardId: string,
    newVotes: (LeanDocument<User> | LeanDocument<ObjectId>)[],
    newComments: LeanDocument<CommentDocument>[],
    cardItems: LeanDocument<CardItemDocument>[],
    session: ClientSession,
  ) {
    const board = await this.boardModel
      .findOneAndUpdate(
        {
          _id: boardId,
          'columns.cards._id': cardId,
        },
        {
          $set: {
            'columns.$.cards.$[card].items.$[cardItem].votes': newVotes,
            'columns.$.cards.$[card].votes': [],
            'columns.$.cards.$[card].items.$[cardItem].comments': newComments,
            'columns.$.cards.$[card].comments': [],
          },
        },
        {
          arrayFilters: [
            { 'card._id': cardId },
            { 'cardItem._id': cardItems[0]._id },
          ],
          new: true,
        },
      )
      .session(session)
      .lean()
      .exec();
    if (!board) throw Error(UPDATE_FAILED);
  }

  async deleteFromCardGroup(
    boardId: string,
    cardId: string,
    cardItemId: string,
    userId: string,
  ) {
    const session = await this.boardModel.db.startSession();
    session.startTransaction();
    try {
      await this.countDeletedVotes(
        boardId,
        cardId,
        userId,
        session,
        cardItemId,
      );

      const card = await this.getCardService.getCardFromBoard(boardId, cardId);
      const cardItems = card?.items.filter(
        (item) => item._id.toString() !== cardItemId,
      );
      if (
        card &&
        cardItems?.length === 1 &&
        (card.votes.length > 0 || card.comments.length > 0)
      ) {
        const newVotes = [...card.votes, ...cardItems[0].votes];
        const newComments = [...card.comments, ...cardItems[0].comments];
        await this.refactorLastItem(
          boardId,
          cardId,
          newVotes,
          newComments,
          cardItems,
          session,
        );
      }

      const board = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards._id': cardId,
          },
          {
            $pull: {
              'columns.$.cards.$[card].items': {
                _id: cardItemId,
                createdBy: userId,
              },
            },
          },
          { arrayFilters: [{ 'card._id': cardId }], new: true },
        )
        .lean()
        .exec();
      if (!board) throw Error(UPDATE_FAILED);
      await session.commitTransaction();
      return board;
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return null;
  }
}
