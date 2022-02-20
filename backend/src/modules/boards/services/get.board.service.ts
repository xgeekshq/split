import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetBoardService } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async getAllBoards(userId: string) {
    return this.boardModel
      .find({
        createdBy: userId,
      })
      .lean();
  }

  async getBoardFromRepo(boardId: string) {
    return this.boardModel.findById(boardId).lean();
  }

  async getBoardWithEmail(boardId: string, userId: string) {
    const board = await this.getBoardFromRepo(boardId);
    if (board && board.isPublic) return board;
    if (!board?.isPublic && board?.createdBy?.toString() === userId)
      return board;
    return null;
  }
}
