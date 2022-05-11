import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardRoles } from '../../../libs/enum/board.roles';
import isEmpty from '../../../libs/utils/isEmpty';
import { GetTeamServiceInterface } from '../../teams/interfaces/services/get.team.service.interface';
import { TYPES } from '../../teams/interfaces/types';
import { UserDocument } from '../../users/schemas/user.schema';
import BoardDto from '../dto/board.dto';
import * as stakeHolders from '../../../libs/utils/ignored_users.json';
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
    @Inject(TYPES.services.GetTeamService)
    private getTeamService: GetTeamServiceInterface,
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
        const { _id } = await this.createBoard(board, userId, true);

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

  async createBoard(boardData: BoardDto, userId: string, isSubBoard = false) {
    const { dividedBoards = [] } = boardData;
    return this.boardModel.create({
      ...boardData,
      createdBy: userId,
      dividedBoards: await this.createDividedBoards(dividedBoards, userId),
      isSubBoard,
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

  async saveBoardUsersFromTeam(
    newUsers: BoardUserDto[],
    users: BoardUserDto[],
    team: string,
  ) {
    const usersIds = users.map((usersFound) => usersFound.user);
    const teamUsers = await this.getTeamService.getUsersOfTeam(team);
    teamUsers.forEach((teamUser) => {
      const user = teamUser.user as UserDocument;
      if (usersIds.includes(user._id.toString())) return;
      newUsers.push({
        user: user._id.toString(),
        role: !stakeHolders.includes(user.email)
          ? BoardRoles.MEMBER
          : BoardRoles.STAKEHOLDER,
        votesCount: 0,
      });
    });
  }

  async create(boardData: BoardDto, userId: string) {
    const { users, team } = boardData;
    const newUsers = this.addOwner(users, userId);

    const newBoard = await this.createBoard(boardData, userId);

    if (!isEmpty(newUsers)) {
      if (team) {
        await this.saveBoardUsersFromTeam(newUsers, users, team);
      }
      this.saveBoardUsers(newUsers, newBoard._id);
    }

    return newBoard;
  }
}
