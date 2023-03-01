import { UserRepositoryInterface } from './../../users/repository/user.repository.interface';
import {
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BOARDS_NOT_FOUND, FORBIDDEN, NOT_FOUND } from 'src/libs/exceptions/messages';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Team from 'src/modules/teams/interfaces/types';
import * as Users from 'src/modules/users/interfaces/types';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import Board, { BoardDocument } from '../entities/board.schema';
import { cleanBoard } from '../utils/clean-board';
import { TYPES } from '../interfaces/types';
import { BoardUserRepositoryInterface } from '../repositories/board-user.repository.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardServiceInterface {
	constructor(
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		@Inject(forwardRef(() => Team.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(Users.TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface,
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface
	) {}

	private readonly logger = new Logger(GetBoardServiceImpl.name);

	async getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		const [boardIds, teamIds] = await Promise.all([
			this.boardUserRepository.getAllBoardsIdsOfUser(userId),
			this.getTeamService.getTeamsOfUser(userId)
		]);

		return {
			boardIds: boardIds.map((boardUser) => String(boardUser.board)),
			teamIds: teamIds.map((team) => team._id)
		};
	}

	async getUserBoardsOfLast3Months(userId: string, page: number, size?: number) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const now = new Date();
		const last3Months = new Date().setMonth(now.getMonth() - 3);
		const query = {
			$and: [
				{ isSubBoard: false, updatedAt: { $gte: last3Months } },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		};

		return this.getBoards(false, query, page, size);
	}

	async getSuperAdminBoards(userId: string, page: number, size?: number) {
		const { boardIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ _id: { $in: boardIds } }, { team: { $ne: null } }] }]
		};

		return this.getBoards(false, query, page, size);
	}

	async getUsersBoards(userId: string, page: number, size?: number) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [
				{ isSubBoard: false },
				{ $or: [{ _id: { $in: boardIds } }, { team: { $in: teamIds } }] }
			]
		};

		return this.getBoards(false, query, page, size);
	}

	getTeamBoards(teamId: string, page: number, size?: number) {
		const query = {
			$and: [{ isSubBoard: false }, { $or: [{ team: teamId }] }]
		};

		return this.getBoards(false, query, page, size);
	}

	async getPersonalUserBoards(userId: string, page: number, size?: number) {
		const { boardIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		const query = {
			$and: [{ isSubBoard: false }, { team: null }, { _id: { $in: boardIds } }]
		};

		return this.getBoards(false, query, page, size);
	}

	async getBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
		const count = await this.boardModel.find(query).countDocuments().exec();
		const hasNextPage = page + 1 < Math.ceil(count / (allBoards ? count : size));
		try {
			const boards = await this.boardModel
				.find(query)
				.sort({ updatedAt: 'desc' })
				.skip(allBoards ? 0 : page * size)
				.limit(allBoards ? count : size)
				.select(
					'-__v -createdAt -slackEnable -slackChannelId -submitedByUser -submitedAt -columns.id -columns._id -columns.cards.text -columns.cards.createdBy -columns.cards.items.text -columns.cards.items.createdBy -columns.cards.createdAt -columns.cards.items.createdAt -columns.cards._id -columns.cards.id -columns.cards.items._id -columns.cards.items.id -columns.cards.createdByTeam -columns.cards.items.createdByTeam -columns.cards.items.votes -columns.cards.items.comments -columns.cards.votes -columns.cards.comments'
				)
				.populate({ path: 'createdBy', select: 'firstName lastName' })
				.populate({
					path: 'team',
					select: 'name users _id',
					populate: {
						path: 'users',
						select: 'user role',
						populate: {
							path: 'user',
							select: '_id firstName lastName joinedAt'
						}
					}
				})
				.populate({
					path: 'dividedBoards',
					select:
						'-__v -createdAt -slackEnable -slackChannelId -submitedAt -id -columns.id -submitedByUser -columns._id -columns.cards.text -columns.cards.createdBy -columns.cards.items.text -columns.cards.items.createdBy -columns.cards.createdAt -columns.cards.items.createdAt -columns.cards._id -columns.cards.id -columns.cards.items._id -columns.cards.items.id -columns.cards.createdByTeam -columns.cards.items.createdByTeam -columns.cards.items.votes -columns.cards.items.comments -columns.cards.votes -columns.cards.comments',
					populate: [
						{
							path: 'users',
							select: 'role user',
							populate: {
								path: 'user',
								model: 'User',
								select: 'firstName email lastName'
							}
						}
					]
				})
				.populate({
					path: 'users',
					select: 'user role -board',
					populate: {
						path: 'user',
						select: '_id firstName email lastName isAnonymous'
					}
				})
				.lean({ virtuals: true })
				.exec();

			return { boards: boards ?? [], hasNextPage, page };
		} catch (e) {
			this.logger.error(BOARDS_NOT_FOUND);
		}

		return { boards: [], hasNextPage, page };
	}

	async getBoard(boardId: string, userId: string) {
		let board = await this.boardRepository.getBoardData(boardId);

		if (!board) throw new NotFoundException(NOT_FOUND);

		const userFound = await this.userRepository.getById(userId);

		if (!userFound) throw new NotFoundException(NOT_FOUND);

		if (!userFound.email && !board.isPublic) throw new ForbiddenException(FORBIDDEN);

		board = cleanBoard(board, userId);

		if (board.isSubBoard) {
			const mainBoard = await this.boardRepository.getMainBoard(boardId);

			return { board, mainBoard };
		}

		return { board };
	}

	async countBoards(userId: string) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		return await this.boardRepository.countBoards(boardIds, teamIds);
	}

	getAllBoardsByTeamId(teamId: string) {
		return this.boardRepository.getAllBoardsByTeamId(teamId);
	}

	getBoardPopulated(boardId: string) {
		return this.boardRepository.getBoardPopulated(boardId);
	}

	getBoardById(boardId: string) {
		return this.boardRepository.getBoard(boardId);
	}

	async isBoardPublic(boardId: string) {
		const { isPublic } = await this.boardModel.findById(boardId).lean().exec();

		return isPublic;
	}
}
