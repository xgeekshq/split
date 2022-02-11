import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPDATE_FAILED } from '../../../libs/exceptions/messages';
import BoardDto from '../dto/board.dto';
import { UpdateBoardService } from '../interfaces/services/update.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class UpdateBoardServiceImpl implements UpdateBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async update(userId: string, boardId: string, boardData: BoardDto) {
    const result = await this.boardModel.findOneAndUpdate(
      {
        _id: boardId,
        createdBy: userId,
      },
      boardData,
      {
        new: true,
        rawResult: true,
      },
    );
    if (result.value && result.lastErrorObject?.updatedExisting)
      return result.value;
    throw new BadRequestException(UPDATE_FAILED);
  }
}
