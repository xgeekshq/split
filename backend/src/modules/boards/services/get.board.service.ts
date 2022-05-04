import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetTeamServiceInterface } from '../../teams/interfaces/services/get.team.service.interface';
import * as Team from '../../teams/interfaces/types';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardServiceInterface {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(BoardUser.name)
    private boardUserModel: Model<BoardUserDocument>,
    @Inject(Team.TYPES.services.GetTeamService)
    private getTeamService: GetTeamServiceInterface,
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
    const [boardIds, teamIds] = await Promise.all([
      this.getAllBoardsIdsOfUser(userId),
      this.getTeamService.getTeamsOfUser(userId),
    ]);
    return { boardIds, teamIds };
  }

  async getUserBoardsOfLast3Months(
    userId: string,
    page: number,
    size?: number,
  ) {
    const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(
      userId,
    );

    const now = new Date();
    const last3Months = new Date().setMonth(now.getMonth() - 3);
    const query = {
      $and: [
        { isSubBoard: false, updatedAt: { $gte: last3Months } },
        { $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] },
      ],
    };

    return this.getBoards(false, query, page, size);
  }

  async getSuperAdminBoards(userId: string, page: number, size?: number) {
    const { boardIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

    const query = {
      $and: [
        { isSubBoard: false },
        { $or: [{ _id: { $in: boardIds } }, { team: { $ne: null } }] },
      ],
    };

    return this.getBoards(true, query, page, size);
  }

  async getUsersBoards(userId: string, page: number, size?: number) {
    const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(
      userId,
    );
    const query = {
      $and: [
        { isSubBoard: false },
        { $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] },
      ],
    };
    return this.getBoards(false, query, page, size);
  }

  async getBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
    const count = await this.boardModel.find(query).countDocuments().exec();
    const hasNextPage =
      page + 1 < Math.ceil(count / (allBoards ? count : size));
    const boards = await this.boardModel
      .find(query)
      .sort({ updatedAt: 'desc' })
      .skip(allBoards ? 0 : page * size)
      .limit(allBoards ? count : size)
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
            select: 'firstName lastName joinedAt',
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
            select: 'firstName lastName joinedAt',
          },
        },
      })
      .populate({
        path: 'users',
        select: 'user role -board',
        populate: {
          path: 'user',
          select: 'firstName lastName joinedAt',
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
        select: 'user role -board votesCount',
        populate: { path: 'user', select: 'firstName lastName _id' },
      })
      .populate({
        path: 'team',
        select: 'name users -_id',
        populate: {
          path: 'users',
          select: 'user role',
          populate: { path: 'user', select: 'firstName lastName joinedAt' },
        },
      })
      .populate({
        path: 'columns.cards.createdBy',
        select: '_id firstName lastName',
      })
      .populate({
        path: 'columns.cards.createdByTeam',
        select: '_id name',
      })
      .populate({
        path: 'columns.cards.items.createdByTeam',
        select: '_id name',
      })
      .populate({
        path: 'columns.cards.items.createdBy',
        select: '_id firstName lastName',
      })
      .populate({
        path: 'columns.cards.comments.createdBy',
        select: '_id  firstName lastName',
      })
      .populate({
        path: 'columns.cards.items.comments.createdBy',
        select: '_id firstName lastName',
      })
      .populate({ path: 'dividedBoards', select: '-__v -createdAt -_id' })
      .lean({ virtuals: true })
      .exec();

    if (!board) return null;

    if (board.isSubBoard) {
      const mainBoard = await this.boardModel
        .findOne({ dividedBoards: { $in: boardId } })
        .select('dividedBoards team')
        .populate({
          path: 'dividedBoards',
          select: '_id title',
        })
        .populate({
          path: 'team',
          select: 'name users _id',
          populate: {
            path: 'users',
            select: 'user role',
            populate: {
              path: 'user',
              select: 'firstName lastName joinedAt',
            },
          },
        })
        .lean({ virtuals: true })
        .exec();
      if (!mainBoard) return null;
      return { board, mainBoardData: mainBoard };
    }

    return { board };
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
