import { BOARD_USER_EXISTS, INSERT_FAILED } from 'src/libs/exceptions/messages';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { CreateUserService } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import { RegisterAuthService } from '../interfaces/services/register.auth.service.interface';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { InjectModel } from '@nestjs/mongoose';
import BoardUser, { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import { Model } from 'mongoose';

@Injectable()
export default class RegisterAuthServiceImpl implements RegisterAuthService {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private createUserService: CreateUserService,
		@InjectModel(BoardUser.name)
		private boardUserModel: Model<BoardUserDocument>
	) {}

	public async register(registrationData: CreateUserDto) {
		const hashedPassword = await encrypt(registrationData.password);

		return this.createUserService.create({
			...registrationData,
			password: hashedPassword
		});
	}

	public async createGuest(guestUserData: CreateGuestUserDto) {
		const { board } = guestUserData;
		const guestUserCreated = await this.createUserService.createGuest(guestUserData);

		if (!guestUserCreated) throw new BadRequestException(INSERT_FAILED);

		const { _id: user } = guestUserCreated;

		await this.createGuestBoardUser(board, user);

		return { board, user };
	}

	public async loginGuest(guestUserData: CreateGuestUserDto) {
		const { board, user } = guestUserData;

		await this.createGuestBoardUser(board, user);

		return { board, user };
	}

	private async createGuestBoardUser(board: string, user: string) {
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
