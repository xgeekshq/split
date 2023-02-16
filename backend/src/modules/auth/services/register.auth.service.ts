import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateBoardService } from 'src/modules/boards/interfaces/services/create.board.service.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { encrypt } from 'src/libs/utils/bcrypt';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { CreateUserService } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { TYPES } from 'src/modules/users/interfaces/types';
import * as Board from 'src/modules/boards/interfaces/types';
import { RegisterAuthService } from '../interfaces/services/register.auth.service.interface';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { BoardRoles } from 'src/libs/enum/board.roles';

@Injectable()
export default class RegisterAuthServiceImpl implements RegisterAuthService {
	constructor(
		@Inject(TYPES.services.CreateUserService)
		private createUserService: CreateUserService,
		@Inject(Board.TYPES.services.CreateBoardService)
		private createBoardService: CreateBoardService
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

		const boardUser = {
			role: BoardRoles.MEMBER,
			board,
			user: guestUserCreated._id,
			votesCount: 0
		};

		const boardUserCreated = await this.createBoardService.saveBoardUsers([boardUser], board);

		if (!boardUserCreated) throw new BadRequestException(INSERT_FAILED);

		return guestUserCreated;
	}
}
