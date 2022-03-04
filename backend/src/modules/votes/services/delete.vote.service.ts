import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCardService } from 'src/modules/cards/interfaces/services/get.card.service.interface';
import { TYPES } from '../../cards/interfaces/types';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteVoteService } from '../interfaces/services/delete.vote.service.interface';
import isEmpty from '../../../libs/utils/isEmpty';

@Injectable()
export default class DeleteVoteServiceImpl implements DeleteVoteService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(TYPES.services.GetCardService)
    private getCardService: GetCardService,
  ) {}

  async deleteVoteFromCard(
    boardId: string,
    cardId: string,
    userId: string,
    cardItemId: string,
  ) {
    const card = await this.getCardService.getCardFromBoard(boardId, cardId);
    if (card) {
      const cardItem = card.items.find(
        (item) => item._id.toString() === cardItemId,
      );
      if (cardItem) {
        const votes = cardItem.votes as unknown as string[];
        votes.splice(
          votes.findIndex((vote) => vote === userId),
          1,
        );

        return this.boardModel
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
          .lean()
          .exec();
      }
    }
    return null;
  }

  async deleteVoteFromCardGroup(
    boardId: string,
    cardId: string,
    userId: string,
  ) {
    const card = await this.getCardService.getCardFromBoard(boardId, cardId);
    if (card) {
      const votes = card.votes as unknown as string[];
      if (isEmpty(votes.length)) {
        for (let i = 0; i < card.items.length; i += 1) {
          const item = card.items[i];
          const itemVotes = item.votes.map(String);
          if (itemVotes.includes(userId.toString())) {
            return this.deleteVoteFromCard(
              boardId,
              cardId,
              userId,
              item._id.toString(),
            );
          }
        }

        return null;
      }

      votes.splice(
        votes.findIndex((vote) => vote === userId),
        1,
      );

      return this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards._id': cardId,
          },
          {
            $set: {
              'columns.$.cards.$[c].votes': votes,
            },
          },
          {
            arrayFilters: [{ 'c._id': cardId }],
            new: true,
          },
        )
        .lean()
        .exec();
    }
    return null;
  }
}
