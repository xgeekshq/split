import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Board, { BoardDocument } from '../../boards/schemas/board.schema';
import { DeleteCommentService } from '../interfaces/services/delete.comment.service.interface';

@Injectable()
export default class DeleteCommentServiceImpl implements DeleteCommentService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  deleteItemComment(boardId: string, commentId: string, userId: string) {
    return this.boardModel
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
        { new: true },
      )
      .lean()
      .exec();
  }
}
