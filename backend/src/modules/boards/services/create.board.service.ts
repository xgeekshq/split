import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INSERT_FAILED } from '../../../libs/exceptions/messages';
import { encrypt } from '../../../libs/utils/bcrypt';
import BoardDto from '../dto/board.dto';
import { CreateBoardService } from '../interfaces/services/create.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class CreateBoardServiceImpl implements CreateBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(boardData: BoardDto, userId: string) {
    if (boardData.password) {
      boardData.password = await encrypt(boardData.password);
    }
    const board = await this.boardModel.create({
      ...boardData,
      createdBy: userId,
    });
    if (board) return board;
    throw new BadRequestException(INSERT_FAILED);
  }
}
