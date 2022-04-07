import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardRoles } from '../../../libs/enum/board.roles';
import { encrypt } from '../../../libs/utils/bcrypt';
import isEmpty from '../../../libs/utils/isEmpty';
import BoardDto from '../dto/board.dto';
import { CreateBoardService } from '../interfaces/services/create.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class CreateBoardServiceImpl implements CreateBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(BoardUser.name)
    private boardUserModel: Model<BoardUserDocument>,
  ) {}

  async createDividedBoards(boards: BoardDto[], userId: string) {
    const newBoardsIds: string[] = [];

    await boards.reduce(async (previous, current) => {
      await previous;
      const newBoard = await this.boardModel.create({
        ...current,
        userId,
        isSubBoard: true,
      });
      const { users } = current;
      newBoardsIds.push(newBoard._id);

      if (!isEmpty(users)) {
        await users.reduce(async (prevUser, currentUser) => {
          await prevUser;
          await this.boardUserModel.create({
            ...currentUser,
            board: newBoard._id,
          });
        }, Promise.resolve());
      }
    }, Promise.resolve());
    return newBoardsIds;
  }

  async create(boardData: BoardDto, userId: string) {
    const { password, dividedBoards, users } = boardData;
    if (password) {
      boardData.password = await encrypt(password);
    }

    const newBoard = await this.boardModel.create({
      ...boardData,
      createdBy: userId,
      dividedBoards: await this.createDividedBoards(
        dividedBoards ?? [],
        userId,
      ),
    });

    const newUsers = [...users];
    newUsers.push({
      user: userId.toString(),
      role: BoardRoles.OWNER,
    });

    if (!isEmpty(newUsers)) {
      await newUsers.reduce(async (prevUser, currentUser) => {
        await prevUser;
        await this.boardUserModel.create({
          ...currentUser,
          board: newBoard._id,
        });
      }, Promise.resolve());
    }

    return newBoard;
  }
}
