import { GetBoardUserServiceInterface } from '../../boardUsers/interfaces/services/get.board.user.service.interface';
import { CreateBoardUserServiceInterface } from '../../boardUsers/interfaces/services/create.board.user.service.interface';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { BOARD_NOT_FOUND, BOARD_USER_NOT_FOUND, NOT_FOUND } from 'src/libs/exceptions/messages';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Users from 'src/modules/users/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import * as Auth from 'src/modules/auth/interfaces/types';
import { QueryType } from '../interfaces/findQuery';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { cleanBoard } from '../utils/clean-board';
import { TYPES } from '../interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import Board from '../entities/board.schema';
import User from 'src/modules/users/entities/user.schema';
import BoardGuestUserDto from '../../boardUsers/dto/board.guest.user.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { LoginGuestUserResponse } from 'src/libs/dto/response/login-guest-user.response';
import UserDto from 'src/modules/users/dto/user.dto';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';

@Injectable()
export default class GetBoardService implements GetBoardServiceInterface {
	constructor(
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		@Inject(BoardUsers.TYPES.services.CreateBoardUserService)
		private createBoardUserService: CreateBoardUserServiceInterface,
		@Inject(Auth.TYPES.services.GetTokenAuthService)
		private getTokenAuthService: GetTokenAuthServiceInterface,
		@Inject(Users.TYPES.services.UpdateUserService)
		private updateUserService: UpdateUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface,
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		private socketService: SocketGateway
	) {}

	async getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		const [boardIds, teamIds] = await Promise.all([
			this.getBoardUserService.getAllBoardsOfUser(userId),
			this.getTeamService.getTeamsOfUser(userId)
		]);

		return {
			boardIds: boardIds.map((boardUser) => boardUser.board),
			teamIds: teamIds.map((team) => team._id)
		};
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

	async getBoard(boardId: string, user: UserDto) {
		let board = await this.boardRepository.getBoardData(boardId);

		if (!board) throw new NotFoundException(NOT_FOUND);

		const guestUser = await this.checkIfPublicBoardAndCreatePublicBoardUsers(board, user);

		board = cleanBoard(board, user._id);

		if (board.isSubBoard) {
			const mainBoard = await this.boardRepository.getMainBoard(boardId);

			return { board, mainBoard };
		}

		if (guestUser) return { guestUser, board };

		return { board };
	}

	async countBoards(userId: string) {
		const { boardIds, teamIds } = await this.getAllBoardIdsAndTeamIdsOfUser(userId);

		return this.boardRepository.countBoards(boardIds, teamIds);
	}

	getBoardPopulated(boardId: string) {
		return this.boardRepository.getBoardPopulated(boardId);
	}

	getBoardById(boardId: string) {
		return this.boardRepository.getBoard(boardId);
	}

	getBoardData(boardId: string) {
		return this.boardRepository.getBoardData(boardId);
	}

	getBoardUser(board: string, user: string) {
		return this.getBoardUserService.getBoardUser(board, user);
	}

	getAllMainBoards() {
		return this.boardRepository.getAllMainBoards();
	}

	async isBoardPublic(boardId: string) {
		const board = await this.boardRepository.isBoardPublic(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		return board.isPublic;
	}

	async getBoards(allBoards: boolean, query: QueryType, page = 0, size = 10) {
		const count = await this.boardRepository.getCountPage(query);

		const hasNextPage = page + 1 < Math.ceil(count / (allBoards ? count : size));

		const boards = await this.boardRepository.getAllBoards(allBoards, query, page, size, count);

		return { boards: boards ?? [], hasNextPage, page };
	}

	/* --------------- HELPERS --------------- */

	private async createBoardUserAndSendAccessToken(
		board: string,
		user: string
	): Promise<LoginGuestUserResponse> {
		const { accessToken } = await this.getTokenAuthService.getTokens(user);
		await this.updateUserService.updateUserUpdatedAtField(user);

		await this.createBoardUserService.createBoardUser(board, user);

		return { accessToken, user };
	}

	private async getGuestBoardUser(board: string, user: string): Promise<BoardGuestUserDto> {
		const userFound = await this.getBoardUserService.getBoardUserPopulated(board, user);

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

	private async checkIfPublicBoardAndCreatePublicBoardUsers(
		{ _id: boardId, isPublic }: Board,
		user: UserDto
	) {
		const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, user._id);

		return !boardUserFound && isPublic && !user.isSAdmin
			? await this.createPublicBoardUsers(boardId, user)
			: undefined;
	}

	private async createPublicBoardUsers(boardId: string, user: UserDto) {
		if (user.isAnonymous) {
			const guestUser = await this.createBoardUserAndSendAccessToken(boardId, user._id);

			await this.sendGuestBoardUser(boardId, user._id);

			return guestUser;
		}
		await this.createBoardUserService.createBoardUser(boardId, user._id);
		await this.sendGuestBoardUser(boardId, user._id);
	}
}
