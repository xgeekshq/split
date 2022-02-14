import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DELETE_FAILED } from '../../../libs/exceptions/messages';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteCardService } from '../interfaces/services/delete.card.service.interface';

@Injectable()
export default class DeleteCardServiceImpl implements DeleteCardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async delete(boardId: string, cardId: string, userId: string) {
    const result = await this.boardModel
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
        { new: true, rawResult: true },
      )
      .exec();

    if (result.value && result.lastErrorObject?.updatedExisting)
      return result.value;

    throw new BadRequestException(DELETE_FAILED);
  }
}
