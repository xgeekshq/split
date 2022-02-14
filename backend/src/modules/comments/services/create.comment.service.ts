import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INSERT_FAILED } from '../../../libs/exceptions/messages';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { CreateCommentService } from '../interfaces/services/create.comment.service.interface';

@Injectable()
export default class CreateCommentServiceImpl implements CreateCommentService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async createItemComment(
    boardId: string,
    cardId: string,
    itemId: string,
    userId: string,
    text: string,
  ) {
    try {
      const result = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards.items._id': itemId,
          },
          {
            $push: {
              'columns.$.cards.$[c].items.$[i].comments': {
                text,
                createdBy: userId,
              },
            },
          },
          {
            arrayFilters: [{ 'c._id': cardId }, { 'i._id': itemId }],
            new: true,
            rawResult: true,
          },
        )

        .exec();
      if (result.value && result.lastErrorObject?.updatedExisting)
        return result.value;
      throw new BadRequestException(INSERT_FAILED);
    } catch (e) {
      throw new BadRequestException(INSERT_FAILED);
    }
  }
}
