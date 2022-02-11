import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BOARDS_NOT_FOUND,
  BOARD_NOT_FOUND,
} from '../../../libs/exceptions/messages';
import { GetBoardService } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async getAllBoards(userId: string) {
    const boards = await this.boardModel.find({
      createdBy: userId,
    });
    if (boards) return boards;
    throw new NotFoundException(BOARDS_NOT_FOUND);
  }

  async getBoardFromRepo(boardId: string) {
    const board = await this.boardModel
      .findById(boardId)
      .populate('createdBy', '-password -currentHashedRefreshToken');
    if (board) return board;
    throw new NotFoundException(BOARD_NOT_FOUND);
  }

  async getBoardWithEmail(boardId: string, userId: string) {
    const board = await this.boardModel.findById({
      _id: boardId,
    });
    if (board && board.isPublic) return board;
    if (!board?.isPublic && board?.createdBy?.toString() === userId)
      return board;
    throw new NotFoundException(BOARD_NOT_FOUND);
  }
}
