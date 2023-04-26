import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BOARD_REPOSITORY } from '../constants';
import * as Auth from 'src/modules/auth/interfaces/types';
import * as Users from 'src/modules/users/constants';
import BoardUseCasePresenter from '../presenter/board.use-case.presenter';
import GetBoardUseCaseDto from '../dto/useCase/get-board.use-case.dto';
import Board from '../entities/board.schema';
import UserDto from 'src/modules/users/dto/user.dto';
import { BOARD_NOT_FOUND, BOARD_USER_NOT_FOUND } from 'src/libs/exceptions/messages';
import { cleanBoard } from '../utils/clean-board';
import { LoginGuestUserResponse } from 'src/libs/dto/response/login-guest-user.response';
import User from 'src/modules/users/entities/user.schema';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import BoardGuestUserDto from 'src/modules/boardUsers/dto/board.guest.user.dto';
import {
	CREATE_BOARD_USER_SERVICE,
	GET_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';

@Injectable()
export class GetBoardUseCase implements UseCase<GetBoardUseCaseDto, BoardUseCasePresenter> {
	constructor(
		@Inject(BOARD_REPOSITORY)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(GET_BOARD_USER_SERVICE)
		private readonly getBoardUserService: GetBoardUserServiceInterface,
		@Inject(CREATE_BOARD_USER_SERVICE)
		private readonly createBoardUserService: CreateBoardUserServiceInterface,
		@Inject(Auth.TYPES.services.GetTokenAuthService)
		private readonly getTokenAuthService: GetTokenAuthServiceInterface,
		@Inject(Users.TYPES.services.UpdateUserService)
		private readonly updateUserService: UpdateUserServiceInterface
	) {}

	async execute({ boardId, user, completionHandler }: GetBoardUseCaseDto) {
		let board = await this.boardRepository.getBoardData(boardId);

		if (!board) throw new NotFoundException(BOARD_NOT_FOUND);

		const guestUser = await this.checkIfPublicBoardAndCreatePublicBoardUsers(
			board,
			user,
			completionHandler
		);

		board = cleanBoard(board, user._id);

		if (board.isSubBoard) {
			const mainBoard = await this.boardRepository.getMainBoard(boardId);

			if (!mainBoard) {
				throw new NotFoundException(BOARD_NOT_FOUND);
			}

			return { board, mainBoard };
		}

		if (guestUser) return { guestUser, board };

		return { board };
	}

	private async checkIfPublicBoardAndCreatePublicBoardUsers(
		{ _id: boardId, isPublic }: Board,
		user: UserDto,
		completionHandler: (boardUser: BoardGuestUserDto) => void
	) {
		const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, user._id);

		return !boardUserFound && isPublic && !user.isSAdmin
			? await this.createPublicBoardUsers(boardId, user, completionHandler)
			: undefined;
	}

	private async createPublicBoardUsers(
		boardId: string,
		user: UserDto,
		completionHandler: (boardUser: BoardGuestUserDto) => void
	) {
		if (user.isAnonymous) {
			const guestUser = await this.createBoardUserAndSendAccessToken(boardId, user._id);

			await this.sendGuestBoardUser(boardId, user._id, completionHandler);

			return guestUser;
		}
		await this.createBoardUserService.createBoardUser(boardId, user._id);
		await this.sendGuestBoardUser(boardId, user._id, completionHandler);
	}

	private async createBoardUserAndSendAccessToken(
		board: string,
		user: string
	): Promise<LoginGuestUserResponse> {
		const { accessToken } = await this.getTokenAuthService.getTokens(user);
		await this.updateUserService.updateUserUpdatedAtField(user);

		await this.createBoardUserService.createBoardUser(board, user);

		return { accessToken, user };
	}

	private async sendGuestBoardUser(
		board: string,
		user: string,
		completionHandler: (boardUser: BoardGuestUserDto) => void
	) {
		const boardUser = await this.getGuestBoardUser(board, user);

		completionHandler(boardUser);
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
}
