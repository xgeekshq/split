import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardRoles } from '../../../libs/enum/board.roles';
import { encrypt } from '../../../libs/utils/bcrypt';
import isEmpty from '../../../libs/utils/isEmpty';
import BoardDto from '../dto/board.dto';
import BoardUserDto from '../dto/board.user.dto';
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

  saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string) {
    Promise.all(
      newUsers.map((user) =>
        this.boardUserModel.create({ ...user, board: newBoardId }),
      ),
    );
  }

  async createDividedBoards(boards: BoardDto[], userId: string) {
    const newBoardsIds = await Promise.allSettled(
      boards.map(async (board) => {
        const { users } = board;
        const { _id } = await this.create(board, userId);

        if (!isEmpty(users)) {
          this.saveBoardUsers(users, _id);
        }

        return _id;
      }),
    );

    return newBoardsIds.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value] : [],
    );
  }

  async createBoard(boardData: BoardDto, userId: string) {
    const { dividedBoards = [] } = boardData;

    return this.boardModel.create({
      ...boardData,
      createdBy: userId,
      dividedBoards: await this.createDividedBoards(dividedBoards, userId),
      isSubBoard: isEmpty(dividedBoards),
    });
  }

  addOwner(users: BoardUserDto[], userId: string) {
    return [
      ...users,
      {
        user: userId.toString(),
        role: BoardRoles.OWNER,
      },
    ];
  }

  async create(boardData: BoardDto, userId: string) {
    const { password, users } = boardData;
    if (password) {
      boardData.password = await encrypt(password);
    }

    const newBoard = await this.createBoard(boardData, userId);

    const newUsers = this.addOwner(users, userId);

    if (!isEmpty(newUsers)) {
      this.saveBoardUsers(newUsers, newBoard._id);
    }

    return newBoard;
  }
}
