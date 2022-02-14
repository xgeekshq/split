import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPDATE_FAILED } from '../../../libs/exceptions/messages';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { UpdateCommentService } from '../interfaces/services/update.comment.service.interface';

@Injectable()
export default class UpdateCommentServiceImpl implements UpdateCommentService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async updateItemComment(
    boardId: string,
    cardId: string,
    cardItemId: string,
    commentId: string,
    userId: string,
    text: string,
  ) {
    try {
      const result = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards.items.comments._id': commentId,
          },
          {
            $set: {
              'columns.$.cards.$[c].items.$[i].comments.$[com].text': text,
            },
          },
          {
            arrayFilters: [
              { 'c._id': cardId },
              { 'i._id': cardItemId },
              { 'com._id': commentId, 'com.createdBy': userId },
            ],
            new: true,
            rawResult: true,
          },
        )
        .exec();
      if (result.value && result.lastErrorObject?.updatedExisting)
        return result.value;
      throw new BadRequestException(UPDATE_FAILED);
    } catch (e) {
      throw new BadRequestException(UPDATE_FAILED);
    }
  }
}
