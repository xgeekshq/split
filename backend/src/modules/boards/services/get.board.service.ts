import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetTeamService } from '../../teams/interfaces/services/get.team.service.interface';
import * as Team from '../../teams/interfaces/types';
import { GetBoardService } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(BoardUser.name)
    private boardUserModel: Model<BoardUserDocument>,
    @Inject(Team.TYPES.services.GetTeamService)
    private getTeamService: GetTeamService,
  ) {}

  getAllBoardsIdsOfUser(userId: string) {
    return this.boardUserModel
      .find({ user: userId })
      .select('board')
      .distinct('board')
      .lean()
      .exec();
  }

  async getAllBoardIdsAndTeamIdsOfUser(userId: string) {
    const boardIds = await this.getAllBoardsIdsOfUser(userId);
    const teamIds = await this.getTeamService.getTeamsOfUser(userId);
    return { boardIds, teamIds };
  }

  async getFindQuery(
    option: 'dashboard' | 'allBoards' | 'myBoards',
    userId: string,
  ) {
    const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(
      userId,
    );

    if (option === 'dashboard') {
      const last3Months = new Date(
        new Date().setMonth(new Date().getMonth() - 3),
      );
      return {
        $and: [
          { isSubBoard: false, updatedAt: { $gte: last3Months } },
          { $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] },
        ],
      };
    }

    if (option === 'myBoards')
      return {
        $and: [
          { isSubBoard: false },
          { $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] },
        ],
      };

    return {
      $and: [
        { isSubBoard: false },
        { $or: [{ _id: { $in: boardIds } }, { team: { $ne: null } }] },
      ],
    };
  }

  async getBoards(
    option: 'dashboard' | 'allBoards' | 'myBoards',
    userId: string,
    page = 0,
    size = 10,
  ) {
    const query = await this.getFindQuery(option, userId);
    const count = await this.boardModel.find(query).countDocuments().exec();
    const hasNextPage =
      page + 1 < Math.ceil(count / (option === 'allBoards' ? count : size));
    const boards = await this.boardModel
      .find(query)
      .sort({ updatedAt: 'desc' })
      .skip(option === 'allBoards' ? 0 : page * size)
      .limit(option === 'allBoards' ? count : size)
      .select('-__v -createdAt -id')
      .populate({ path: 'createdBy', select: 'firstName lastName' })
      .populate({
        path: 'team',
        select: 'name users _id',
        populate: {
          path: 'users',
          select: 'user role',
          populate: {
            path: 'user',
            select: 'firstName lastName',
          },
        },
      })
      .populate({
        path: 'dividedBoards',
        select: '-__v -createdAt -id',
        populate: {
          path: 'users',
          select: 'role user',
          populate: {
            path: 'user',
            model: 'User',
            select: 'firstName lastName',
          },
        },
      })
      .populate({
        path: 'users',
        select: 'user role -board',
        populate: {
          path: 'user',
          select: 'firstName lastName',
        },
      })
      .lean({ virtuals: true })
      .exec();

    return { boards, hasNextPage, page };
  }

  getBoardFromRepo(boardId: string) {
    return this.boardModel.findById(boardId).lean().exec();
  }

  async getBoard(boardId: string) {
    const board = await this.boardModel
      .findById(boardId)
      .populate({
        path: 'users',
        select: 'user role -board',
      })
      .populate({
        path: 'team',
        select: 'name users -_id',
        populate: {
          path: 'users',
          select: 'user role',
        },
      })
      .lean({ virtuals: true })
      .exec();
    if (!board) return null;
    return board;
  }

  async countBoards(userId: string) {
    const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(
      userId,
    );
    return this.boardModel.countDocuments({
      $and: [
        { isSubBoard: false },
        { $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] },
      ],
    });
  }
}
