import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import BoardEntity from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BoardDto from './dto/board.dto';
import { ObjectId } from 'mongodb';
import { compare, encrypt } from '../utils/bcrypt';
import { BOARD_NOT_FOUND, BOARDS_NOT_FOUND } from '../constants/httpExceptions';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardsRepository: Repository<BoardEntity>,
  ) {}

  async create(boardData: BoardDto) {
    if (boardData.password) {
      boardData.password = await encrypt(boardData.password);
    }
    const newBoard = this.boardsRepository.create(boardData);
    await this.boardsRepository.save(newBoard);
    return newBoard;
  }

  async getAllBoards(email: string) {
    const boards = await this.boardsRepository.find({
      where: {
        createdBy: email,
      },
    });
    if (!boards)
      return new HttpException(BOARDS_NOT_FOUND, HttpStatus.NOT_FOUND);
    return boards;
  }

  async getBoardFromRepo(boardId: string) {
    const board = await this.boardsRepository.findOne({
      where: {
        _id: new ObjectId(boardId),
      },
    });
    if (!board) {
      throw new HttpException(BOARD_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return board;
  }

  async getBoard(id: string, password?: string) {
    const board = await this.getBoardFromRepo(id);
    if (!board.locked) {
      return board;
    } else if (board.locked && password) {
      if (await compare(password, board.password)) {
        return board;
      }
    }
    return { locked: true };
  }

  async updateLocked(
    locked: boolean,
    password: string | null,
    boardId: string,
    email: string,
  ) {
    const board = await this.getBoardFromRepo(boardId);
    if (board.createdBy === email) {
      if (locked === false) {
        password = null;
      }
      const hashedPw = password ? await encrypt(password) : null;
      await this.boardsRepository.update(boardId, {
        locked,
        password: hashedPw,
      });
      const board = await this.getBoardFromRepo(boardId);
      return board;
    } else {
      throw new HttpException(BOARD_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }
  }
}
