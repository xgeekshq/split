import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
import BoardUser, { BoardUserDocument } from '../entities/board.user.schema';
import { BOARD_USER_EXISTS, INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateBoardUserServiceInterface } from '../interfaces/services/create.board.user.service.interface';
import { Model } from 'mongoose';
import BoardUserDto from '../dto/board.user.dto';

@Injectable()
export default class CreateBoardUserService implements CreateBoardUserServiceInterface {
	private logger = new Logger(CreateBoardUserService.name);

	constructor(
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}

	saveBoardUsers(newUsers: BoardUserDto[], newBoardId: string) {
		return Promise.all(
			newUsers.map((user) => this.boardUserModel.create({ ...user, board: newBoardId }))
		);
	}

	async createBoardUser(board: string, user: string) {
		const boardUserFound = await this.boardUserModel.findOne({ board, user });

		if (boardUserFound) throw new BadRequestException(BOARD_USER_EXISTS);

		const boardUser = {
			role: BoardRoles.MEMBER,
			board,
			user,
			votesCount: 0
		};
		const boardUserCreated = await this.boardUserModel.create(boardUser);

		if (!boardUserCreated) throw new BadRequestException(INSERT_FAILED);

		return boardUserCreated;
	}
}
