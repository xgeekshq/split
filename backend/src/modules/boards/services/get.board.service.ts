import { CreateBoardUserServiceInterface } from './../interfaces/services/create.board.user.service.interface';
import TeamUser from 'src/modules/teams/entities/team.user.schema';
import Team from 'src/modules/teams/entities/teams.schema';
import { UserRepositoryInterface } from './../../users/repository/user.repository.interface';
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import {
	BOARDS_NOT_FOUND,
	BOARD_USER_NOT_FOUND,
	FORBIDDEN,
	NOT_FOUND
} from 'src/libs/exceptions/messages';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Users from 'src/modules/users/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Auth from 'src/modules/auth/interfaces/types';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { cleanBoard } from '../utils/clean-board';
import { TYPES } from '../interfaces/types';
import { BoardUserRepositoryInterface } from '../repositories/board-user.repository.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import Board from '../entities/board.schema';
import { PopulateType } from 'src/libs/repositories/interfaces/base.repository.interface';
import { TeamRoles } from 'src/libs/enum/team.roles';
import User from 'src/modules/users/entities/user.schema';
import { LoginGuestUserResponse } from 'src/libs/dto/response/login-guest-user.response';
import { GetTokenAuthService } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import BoardGuestUserDto from '../dto/board.guest.user.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class GetBoardServiceImpl implements GetBoardServiceInterface {
	constructor(
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(Boards.TYPES.services.CreateBoardUserService)
		private createBoardUserService: CreateBoardUserServiceInterface,
		@Inject(Auth.TYPES.services.GetTokenAuthService)
		private getTokenAuthService: GetTokenAuthService,
		@Inject(Users.TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface,
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		private socketService: SocketGateway
	) {}

	private readonly logger = new Logger(GetBoardServiceImpl.name);

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

	async getBoard(boardId: string, userId: string) {
		let board = await this.boardRepository.getBoardData(boardId);

		if (!board) throw new NotFoundException(NOT_FOUND);

		const userFound = await this.userRepository.getById(userId);

		if (!userFound) throw new NotFoundException(NOT_FOUND);

		const { guestUser, canSeeBoard } = await this.checkIfUserCanSeeBoardAndCreatePublicBoardUsers(
			board,
			userFound
		);

		if (!canSeeBoard) throw new ForbiddenException(FORBIDDEN);

		board = cleanBoard(board, userFound._id);

		if (board.isSubBoard) {
			const mainBoard = await this.boardRepository.getMainBoard(boardId);

			return { board, mainBoard };
		}

		if (guestUser) return { guestUser, board };

		return { board };
	}

	async countBoards(userId: string) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		return await this.boardRepository.countBoards(boardIds, teamIds);
	}

	async getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		const [boardIds, teamIds] = await Promise.all([
			this.boardUserRepository.getAllBoardsIdsOfUser(userId),
			this.getTeamService.getTeamsOfUser(userId)
		]);

		return {
			boardIds: boardIds.map((boardUser) => boardUser.board),
			teamIds: teamIds.map((team) => team._id)
		};
	}

	getAllBoardsByTeamId(teamId: string) {
		return this.boardRepository.getAllBoardsByTeamId(teamId);
	}

	getBoardPopulated(boardId: string, populate?: PopulateType) {
		return this.boardRepository.getBoardPopulated(boardId, populate);
	}

	getBoardById(boardId: string) {
		return this.boardRepository.getBoard(boardId);
	}

	/* --------------- HELPERS --------------- */

	private async getBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
		const count = await this.boardRepository.getCountPage(query);

		const hasNextPage = page + 1 < Math.ceil(count / (allBoards ? count : size));
		try {
			const boards = await this.boardRepository.getAllBoards(allBoards, query, page, size, count);

			return { boards: boards ?? [], hasNextPage, page };
		} catch (e) {
			this.logger.error(BOARDS_NOT_FOUND);
		}

		return { boards: [], hasNextPage, page };
	}

	private async getBoardUsers(board: string, user: string) {
		return await this.boardUserRepository.getBoardUsers(board, user);
	}

	private async createBoardUserAndSendAccessToken(
		board: string,
		user: string
	): Promise<LoginGuestUserResponse> {
		const { accessToken } = await this.getTokenAuthService.getTokens(user);
		this.userRepository.findOneByFieldAndUpdate({ _id: user }, { $set: { updatedAt: new Date() } });

		await this.createBoardUserService.createBoardUser(board, user);

		return { accessToken, user };
	}

	private async getGuestBoardUser(board: string, user: string): Promise<BoardGuestUserDto> {
		const userFound = await this.boardUserRepository.getBoardUser(
			board,
			user,
			{},
			{
				path: 'user',
				select: '_id firstName lastName '
			}
		);

		if (!userFound) {
			throw new BadRequestException(BOARD_USER_NOT_FOUND);
		}

		const { _id, firstName, lastName, isAnonymous } = userFound.user as User;

		return {
			role: userFound.role,
			board: String(userFound.board),
			votesCount: userFound.votesCount,
			user: {
				_id: String(_id),
				firstName,
				lastName,
				isAnonymous
			}
		};
	}

	private async sendGuestBoardUser(board: string, user: string) {
		const boardUser = await this.getGuestBoardUser(board, user);

		this.socketService.sendUpdateBoardUsers(boardUser);
	}

	private async checkIfUserCanSeeBoardAndCreatePublicBoardUsers(board: Board, user: User) {
		const boardUserFound = await this.getBoardUsers(board._id, user._id);
		let guestUser: LoginGuestUserResponse;

		if (!boardUserFound.length) {
			if (board.isPublic && !user.isSAdmin) {
				guestUser = (await this.createPublicBoardUsers(board._id, user)) as LoginGuestUserResponse;
				this.sendGuestBoardUser(board._id, user._id);
			} else {
				const hasPermissions = this.isAllowedToSeePrivateBoard(board, user);

				if (!hasPermissions) return { canSeeBoard: hasPermissions };
			}
		}

		return { guestUser, canSeeBoard: true };
	}

	private async createPublicBoardUsers(boardId: string, user: User) {
		const boardUserCreated = user.isAnonymous
			? await this.createBoardUserAndSendAccessToken(boardId, user._id)
			: await this.createBoardUserService.createBoardUser(boardId, user._id);

		if (user.isAnonymous) return boardUserCreated;
	}

	private isAllowedToSeePrivateBoard(board: Board, user: User) {
		const teamUser = (board.team as Team).users.find(
			(teamUser: TeamUser) => (teamUser.user as User)._id.toString() === user._id.toString()
		);

		return (
			!user.isAnonymous &&
			(user.isSAdmin || (TeamRoles.ADMIN, TeamRoles.STAKEHOLDER).includes(teamUser.role))
		);
	}
}
