import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import isEmpty from '../../../libs/utils/isEmpty';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import CardDto from '../dto/card.dto';
import { CreateCardService } from '../interfaces/services/create.card.service.interface';

@Injectable()
export default class CreateCardServiceImpl implements CreateCardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(
    cardId: string,
    userId: string,
    card: CardDto,
    colIdToAdd: string,
  ) {
    card.createdBy = userId;

    if (isEmpty(card.items)) {
      card.items.push({
        text: card.text,
        createdBy: userId,
        comments: [],
      });
    }
    return this.boardModel
      .findOneAndUpdate(
        {
          _id: cardId,
          'columns._id': colIdToAdd,
        },
        {
          $push: {
            'columns.$.cards': {
              $each: [{ ...card }],
              $position: 0,
            },
          },
        },
        { new: true },
      )
      .lean();
  }
}
