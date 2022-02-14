import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DELETE_FAILED } from '../../../libs/exceptions/messages';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';

@Injectable()
export default class DeleteCommentServiceImpl implements DeleteCommentService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async deleteItemComment(boardId: string, commentId: string, userId: string) {
    try {
      const result = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns.cards.items.comments._id': commentId,
          },
          {
            $pull: {
              'columns.$.cards.$[].items.$[].comments': {
                _id: commentId,
                createdBy: userId,
              },
            },
          },
          { new: true, rawResult: true },
        )
        .exec();
      if (result.value && result.lastErrorObject?.updatedExisting)
        return result.value;
      throw new BadRequestException(DELETE_FAILED);
    } catch (e) {
      throw new BadRequestException(DELETE_FAILED);
    }
  }
}
