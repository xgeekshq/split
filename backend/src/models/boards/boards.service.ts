import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BOARDS_NOT_FOUND,
  BOARD_NOT_FOUND,
  DELETE_FAILED,
  INSERT_FAILED,
  UPDATE_FAILED,
} from '../../constants/httpExceptions';
import Board, { BoardDocument } from './schemas/board.schema';
import BoardDto from './dto/board.dto';
import { encrypt } from '../../utils/bcrypt';
import Card from './schemas/card.schema';
import { UpdateCardPositionDto } from './dto/card/updateCardPosition.dto';

@Injectable()
export default class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  // #region BOARD

  async create(boardData: BoardDto, userId: string) {
    if (boardData.password) {
      boardData.password = await encrypt(boardData.password);
    }
    const board = await this.boardModel.create({
      ...boardData,
      createdBy: userId,
    });
    if (board) return board;
    throw new HttpException(INSERT_FAILED, HttpStatus.BAD_REQUEST);
  }

  async getAllBoards(id: string) {
    const boards = await this.boardModel.find({
      createdBy: id,
    });
    if (boards) return boards;
    throw new HttpException(BOARDS_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getBoardFromRepo(boardId: string) {
    const board = await this.boardModel
      .findById(boardId)
      .populate('createdBy', '-password -currentHashedRefreshToken');
    if (board) return board;
    throw new HttpException(BOARD_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getBoardWithEmail(id: string, userId: string) {
    const board = await this.boardModel.findById({
      _id: id,
    });
    if (board && board.isPublic) return board;
    if (!board?.isPublic && board?.createdBy?.toString() === userId)
      return board;
    throw new HttpException(BOARD_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async updateBoard(userId: string, boardData: BoardDto) {
    const result = await this.boardModel.findOneAndUpdate(
      {
        _id: boardData._id,
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
    throw new HttpException(UPDATE_FAILED, HttpStatus.BAD_REQUEST);
  }

  async deleteBoard(id: string, userId: string) {
    const result = await this.boardModel.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    if (result) {
      return HttpStatus.OK;
    }
    throw new HttpException(DELETE_FAILED, HttpStatus.BAD_REQUEST);
  }

  // #endregion

  // #region CARD

  async getCardFromBoard(boardId: string, cardId: string): Promise<Card> {
    const result = await this.boardModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(boardId),
          'columns.cards._id': new Types.ObjectId(cardId),
        },
      },
      {
        $unwind: {
          path: '$columns',
        },
      },
      {
        $unwind: {
          path: '$columns.cards',
        },
      },
      {
        $project: {
          card: '$columns.cards',
          _id: 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$card',
        },
      },
      {
        $match: {
          _id: new Types.ObjectId(cardId),
        },
      },
    ]);

    return result.length === 1 ? result[0] : null;
  }

  async updateCardPosition(
    boardId: string,
    cardId: string,
    updateCardPositionDto: UpdateCardPositionDto,
  ) {
    const { columnId, position } = updateCardPositionDto;

    const cardToMove = await this.getCardFromBoard(boardId, cardId);

    if (cardToMove) {
      const pullResult = await this.boardModel
        .updateOne(
          {
            _id: boardId,
            'columns.cards._id': cardId,
          },
          {
            $pull: {
              'columns.$[].cards': { _id: cardId },
            },
          },
        )
        .exec();

      if (pullResult.modifiedCount !== 1) {
        throw new HttpException(UPDATE_FAILED, HttpStatus.BAD_REQUEST);
      }

      const pushResult = await this.boardModel
        .findOneAndUpdate(
          {
            _id: boardId,
            'columns._id': columnId,
          },
          {
            $push: {
              'columns.$.cards': {
                $each: [cardToMove],
                $position: position,
              },
            },
          },
          { rawResult: true, new: true },
        )
        .exec();

      if (pushResult.lastErrorObject?.updatedExisting && pushResult.value) {
        return pushResult.value;
      }
    }
    throw new HttpException(UPDATE_FAILED, HttpStatus.BAD_REQUEST);
  }

  // #endregion
}
