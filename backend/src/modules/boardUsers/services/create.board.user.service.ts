import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BOARD_USER_EXISTS, INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateBoardUserServiceInterface } from '../interfaces/services/create.board.user.service.interface';
import BoardUserDto from '../dto/board.user.dto';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class CreateBoardUserService implements CreateBoardUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.BoardUserRepository)
		private readonly boardUserRepository: BoardUserRepositoryInterface
	) {}

	saveBoardUsers(newUsers: BoardUserDto[], newBoardId?: string) {
		let boardUsersToInsert: BoardUserDto[] = newUsers;

		if (newBoardId) {
			boardUsersToInsert = newUsers.map((boardUser) => ({
				...boardUser,
				board: newBoardId
			}));
		}

		return this.boardUserRepository.createBoardUsers(boardUsersToInsert);
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
}
