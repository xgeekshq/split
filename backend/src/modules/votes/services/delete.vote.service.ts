import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { GetCardService } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import { TYPES } from '../../cards/interfaces/types';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteVoteService } from '../interfaces/services/delete.vote.service.interface';
import isEmpty from '../../../libs/utils/isEmpty';
import { arrayIdToString } from '../../../libs/utils/arrayIdToString';
import BoardUser, {
  BoardUserDocument,
} from '../../boards/schemas/board.user.schema';
import { UPDATE_FAILED } from '../../../libs/exceptions/messages';

@Injectable()
export default class DeleteVoteServiceImpl implements DeleteVoteService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(TYPES.services.GetCardService)
    private getCardService: GetCardService,
    @InjectModel(BoardUser.name)
    private boardUserModel: Model<BoardUserDocument>,
  ) {}

  async decrementVoteUser(
    boardId: string,
    userId: string,
    session: ClientSession,
    count?: number,
  ) {
    const boardUser = await this.boardUserModel
      .findOneAndUpdate(
        {
          user: userId,
          board: boardId,
        },
        {
          $inc: { votesCount: !count ? -1 : -count },
        },
      )
      .session(session)
      .lean()
      .exec();
    if (!boardUser) throw Error(UPDATE_FAILED);
    return boardUser;
  }

  async deleteVoteFromCard(
    boardId: string,
    cardId: string,
    userId: string,
    cardItemId: string,
  ) {
    const session = await this.boardModel.startSession();
    session.startTransaction();
    try {
      const card = await this.getCardService.getCardFromBoard(boardId, cardId);
      if (!card) return null;

      const cardItem = card.items.find(
        (item) => item._id.toString() === cardItemId,
      );
      if (!cardItem) return null;

      const votes = cardItem.votes as unknown as string[];

      const voteIndex = votes.findIndex(
        (vote) => vote.toString() === userId.toString(),
      );

      if (voteIndex === -1) return null;

      votes.splice(voteIndex, 1);

      await this.decrementVoteUser(boardId, userId, session);
      const board = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards.items._id': cardItemId,
          },
          {
            $set: {
              'columns.$.cards.$[c].items.$[i].votes': votes,
            },
          },
          {
            arrayFilters: [{ 'c._id': cardId }, { 'i._id': cardItemId }],
            new: true,
          },
        )
        .populate({
          path: 'users',
          select: 'user role votesCount -board',
          populate: { path: 'user', select: 'firstName lastName _id' },
        })
        .session(session)
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

  async deleteVoteFromCardGroup(
    boardId: string,
    cardId: string,
    userId: string,
  ) {
    const session = await this.boardModel.startSession();
    session.startTransaction();
    try {
      const card = await this.getCardService.getCardFromBoard(boardId, cardId);
      if (!card) return null;

      const { votes } = card;
      const newVotes = arrayIdToString(votes as unknown as string[]);

      if (isEmpty(votes.length)) {
        const item = card.items.find(({ votes: itemVotes }) =>
          arrayIdToString(itemVotes as unknown as string[]).includes(
            userId.toString(),
          ),
        );

        if (!item) return null;

        const boardUser = await this.deleteVoteFromCard(
          boardId,
          cardId,
          userId,
          item._id.toString(),
        );
        await session.commitTransaction();

        return boardUser;
      }

      const voteIndex = newVotes.findIndex(
        (vote) => vote.toString() === userId.toString(),
      );
      if (voteIndex === -1) return null;
      newVotes.splice(voteIndex, 1);

      await this.decrementVoteUser(boardId, userId, session);
      const board = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards._id': cardId,
          },
          {
            $set: {
              'columns.$.cards.$[c].votes': newVotes,
            },
          },
          {
            arrayFilters: [{ 'c._id': cardId }],
            new: true,
          },
        )
        .session(session)
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
