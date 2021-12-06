import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UpdateBoardPayload, {
  ChangesBoard,
} from '../interfaces/updateBoardPayload.interface';
import {
  BOARDS_NOT_FOUND,
  BOARD_NOT_FOUND,
  describeExceptions,
} from '../constants/httpExceptions';
import BoardEntity from './entity/board.entity';
import BoardDto from './dto/board.dto';
import { encrypt, compare } from '../utils/bcrypt';

@Injectable()
export default class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardsRepository: Repository<BoardEntity>,
  ) {}

  async create(boardData: BoardDto) {
    if (boardData.password) {
      boardData.password = await encrypt(boardData.password);
    }
    const newBoard = this.boardsRepository.create(boardData);
    return this.boardsRepository.save(newBoard);
  }

  async getAllBoards(email: string) {
    const boards = await this.boardsRepository.find({
      where: {
        'createdBy.email': email,
      },
    });
    if (boards) return boards;
    throw new HttpException(
      describeExceptions(BOARDS_NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }

  async getBoardFromRepo(boardId: string) {
    const board = await this.boardsRepository.findOne(boardId);
    if (board) return board;
    throw new HttpException(
      describeExceptions(BOARD_NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }

  updateBoard(boardData: BoardEntity) {
    delete boardData._id;
    return this.boardsRepository.save(boardData);
  }

  async getBoardWithPassword(id: string, password?: string) {
    const board = await this.getBoardFromRepo(id);
    if (!board.locked) return board;

    if (!password || !board.password)
      throw new HttpException("Can't unlock", HttpStatus.UNAUTHORIZED);

    const isPasswordMatched = await compare(password, board.password);
    if (isPasswordMatched) return board;

    return { locked: true };
  }

  async getBoardWithEmail(id: string, email: string) {
    const board = await this.getBoardFromRepo(id);
    if (!board.locked) return board;
    if (board.createdBy.email === email) return board;
    return { locked: true };
  }

  async updateLocked(
    locked: boolean,
    password: string | null,
    boardId: string,
    email: string,
  ): Promise<BoardEntity> {
    const board = await this.getBoardFromRepo(boardId);
    if (board.createdBy.email !== email) {
      throw new HttpException(
        describeExceptions(BOARD_NOT_FOUND),
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (locked === false) {
      password = null;
    }
    const hashedPw = password ? await encrypt(password) : undefined;
    await this.boardsRepository.update(boardId, {
      locked,
      password: hashedPw,
    });
    return this.getBoardFromRepo(boardId);
  }

  async updateBoardPatch(payload: UpdateBoardPayload) {
    const board = await this.getBoardFromRepo(payload.id);
    const newBoard = this.transformBoard(board, payload.changes);
    const result = await this.boardsRepository.update(payload.id, newBoard);
    return result.raw.result.ok === 1;
  }

  transformBoard = (board: BoardEntity, changes: ChangesBoard) => {
    const newBoard = { ...board };

    if (changes.type === 'card') {
      const colToRemove = newBoard.columns.find(
        (col) => col._id === changes.colToRemove,
      );
      const colToAdd = newBoard.columns.find(
        (col) => col._id === changes.colToAdd,
      );
      const cardToAdd = colToRemove?.cardsOrder[changes.cardToRemove];
      if (!cardToAdd) return newBoard;
      colToRemove?.cardsOrder.splice(changes.cardToRemove, 1);
      colToAdd?.cardsOrder.splice(changes.cardToAdd, 0, cardToAdd);
    } else {
      const newCol = newBoard.columnsOrder[changes.cardToRemove];
      newBoard.columnsOrder.splice(changes.cardToRemove, 1);
      newBoard.columnsOrder.splice(changes.cardToAdd, 0, newCol);
    }
    return newBoard;
  };
}
