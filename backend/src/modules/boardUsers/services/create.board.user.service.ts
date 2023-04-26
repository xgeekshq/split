import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BOARD_USER_EXISTS, CREATE_FAILED, INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateBoardUserServiceInterface } from '../interfaces/services/create.board.user.service.interface';
import BoardUserDto from '../dto/board.user.dto';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { BOARD_USER_REPOSITORY } from '../constants';
import BoardUser from '../entities/board.user.schema';

@Injectable()
export default class CreateBoardUserService implements CreateBoardUserServiceInterface {
	constructor(
		@Inject(BOARD_USER_REPOSITORY)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

	async saveBoardUsers(newUsers: BoardUserDto[], newBoardId?: string, withSession?: boolean) {
		let boardUsersToInsert: BoardUserDto[] = newUsers;

		if (newBoardId) {
			boardUsersToInsert = newUsers.map((boardUser) => ({
				...boardUser,
				board: newBoardId
			}));
		}
		const createdBoardUsers: BoardUser[] = await this.boardUserRepository.createBoardUsers(
			boardUsersToInsert,
			withSession
		);

		if (createdBoardUsers.length < boardUsersToInsert.length)
			throw new BadRequestException(CREATE_FAILED);

		return createdBoardUsers;
	}

	async createBoardUser(board: string, user: string) {
		const boardUserFound = await this.boardUserRepository.findOneByField({ board, user });

		if (boardUserFound) throw new BadRequestException(BOARD_USER_EXISTS);

		const boardUser = {
			role: BoardRoles.MEMBER,
			board,
			user,
			votesCount: 0
		};

		const boardUserCreated = await this.boardUserRepository.create(boardUser);

		if (!boardUserCreated) throw new BadRequestException(INSERT_FAILED);

		return boardUserCreated;
	}

	startTransaction(): Promise<void> {
		return this.boardUserRepository.startTransaction();
	}

	commitTransaction(): Promise<void> {
		return this.boardUserRepository.commitTransaction();
	}

	abortTransaction(): Promise<void> {
		return this.boardUserRepository.abortTransaction();
	}

	endSession(): Promise<void> {
		return this.boardUserRepository.endSession();
	}
}
