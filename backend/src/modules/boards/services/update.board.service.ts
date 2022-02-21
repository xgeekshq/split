import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BoardDto from '../dto/board.dto';
import { UpdateBoardService } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  update(userId: string, boardId: string, boardData: BoardDto) {
    return this.boardModel
      .findOneAndUpdate(
        {
          _id: boardId,
          createdBy: userId,
        },
        boardData,
        {
          new: true,
        },
      )
      .lean()
      .exec();
  }
}
