import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INSERT_FAILED } from '../../../libs/exceptions/messages';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import CardDto from '../dto/card.dto';
import { CreateCardService } from '../interfaces/services/create.card.service.interface';

@Injectable()
export default class CreateCardServiceImpl implements CreateCardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(
    cardId: number,
    userId: string,
    card: CardDto,
    colIdToAdd: string,
  ) {
    card.createdBy = userId.toString();

    if (card.items.length === 0) {
      card.items.push({
        text: card.text,
        createdBy: userId,
        comments: [],
      });
    }
    const result = await this.boardModel
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
        { new: true, rawResult: true },
      )
      .exec();
    if (result.value && result.lastErrorObject?.updatedExisting)
      return result.value;
    throw new BadRequestException(INSERT_FAILED);
  }
}
