import { INSERT_FAILED } from 'src/libs/exceptions/messages';
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

	public async loginGuest(guestUserData: CreateGuestUserDto) {
		console.log('guestUser board');
		await this.createGuestBoardUser(guestUserData.board, guestUserData.user);
	}

	public async register(registrationData: CreateUserDto) {
		const hashedPassword = await encrypt(registrationData.password);

		return this.createUserService.create({
			...registrationData,
			password: hashedPassword
		});
	}

	public async createGuest(guestUserData: CreateGuestUserDto) {
		console.log('guestUser user and board');
		const { board } = guestUserData;
		const guestUserCreated = await this.createUserService.createGuest(guestUserData);

		if (!guestUserCreated) throw new BadRequestException(INSERT_FAILED);

		await this.createGuestBoardUser(board, guestUserCreated._id);

		return guestUserCreated;
	}

	private async createGuestBoardUser(board: string, user: string) {
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
