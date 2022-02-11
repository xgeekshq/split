import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DELETE_FAILED } from '../../../libs/exceptions/messages';
import { DeleteBoardService } from '../interfaces/services/delete.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class DeleteBoardServiceImpl implements DeleteBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async delete(boardId: string, userId: string) {
    const result = await this.boardModel.deleteOne({
      _id: boardId,
      createdBy: userId,
    });
    if (result.deletedCount === 1) {
      return 'OK';
    }
    throw new BadRequestException(DELETE_FAILED);
  }
}
