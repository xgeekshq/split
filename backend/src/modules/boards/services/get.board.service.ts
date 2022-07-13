import { Inject, Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, LeanDocument, Model } from 'mongoose';
import { UserDocument } from 'src/modules/users/schemas/user.schema';
import { BOARDS_NOT_FOUND } from '../../../libs/exceptions/messages';
import { GetTeamServiceInterface } from '../../teams/interfaces/services/get.team.service.interface';
import * as Team from '../../teams/interfaces/types';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../schemas/board.schema';
import BoardUser, { BoardUserDocument } from '../schemas/board.user.schema';
import { hideText } from '../../../libs/utils/hideText';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardServiceInterface {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(BoardUser.name)
    private boardUserModel: Model<BoardUserDocument>,
    @Inject(Team.TYPES.services.GetTeamService)
    private getTeamService: GetTeamServiceInterface,
  ) {}

  private readonly logger = new Logger(GetBoardServiceImpl.name);

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
    return { boardIds, teamIds: teamIds.map((team) => team._id) };
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
    try {
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
      return { boards: boards ?? [], hasNextPage, page };
    } catch (e) {
      this.logger.error(BOARDS_NOT_FOUND);
    }
    return { boards: [], hasNextPage, page };
  }

  getBoardFromRepo(boardId: string) {
    return this.boardModel.findById(boardId).lean().exec();
  }

  async getMainBoardData(boardId: string) {
    const mainBoard = await this.boardModel
      .findOne({ dividedBoards: { $in: boardId } })
      .select('dividedBoards team title')
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

    return mainBoard;
  }

  async getBoard(boardId: string, userId: string) {
    let board = await this.getBoardData(boardId);

    if (!board) return null;

    // keep votes only for one user by userId
    if (board.hideVotes || board.hideCards) {
      board = this.cleanVotes(userId, board);
    }

    if (board.isSubBoard) {
      const mainBoard = await this.getMainBoardData(boardId);
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

  private async getBoardData(boardId: string) {
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
      .populate({
        path: 'dividedBoards',
        select: '-__v -createdAt -id',
        populate: {
          path: 'users',
          select: 'role user',
        },
      })
      .lean({ virtuals: true })
      .exec();
    return board;
  }

  private cleanVotes(
    userId: string,
    input: LeanDocument<Board & Document & { _id: ObjectId }>,
  ): LeanDocument<Board & Document & { _id: ObjectId }> {
    const { hideVotes } = input;

    const columns = input.columns.map((column) => {
      const cards = column.cards.map((card) => {
        const votesFromCard = hideVotes
          ? (card.votes as UserDocument[]).filter(
              (cardVotes) => String(cardVotes._id) === String(userId),
            )
          : card.votes;

        const items = card.items.map((item) => {
          const votesFromItem = hideVotes
            ? (item.votes as UserDocument[]).filter(
                (itemVotes) => String(itemVotes._id) === String(userId),
              )
            : item.votes;

          return {
            ...item,
            votes: votesFromItem,
          };
        });

        return {
          ...card,
          items,
          votes: votesFromCard,
        };
      });

      return {
        ...column,
        cards,
      };
    });

    return { ...input, columns };
  }
}
