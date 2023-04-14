import { Inject, Injectable } from '@nestjs/common';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import isEmpty from 'src/libs/utils/isEmpty';
import BoardUserDto from 'src/modules/boardUsers/dto/board.user.dto';
import UpdateBoardUserDto from 'src/modules/boardUsers/dto/update-board-user.dto';
import BoardUser from 'src/modules/boardUsers/entities/board.user.schema';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import User from 'src/modules/users/entities/user.schema';

export type BoardParticipantsPresenter = BoardUser | BoardUser[];

@Injectable()
export class UpdateBoardParticipantsUseCase
	implements UseCase<UpdateBoardUserDto, BoardParticipantsPresenter>
{
	constructor(
		@Inject(BoardUsers.TYPES.services.CreateBoardUserService)
		private readonly createBoardUserService: CreateBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.DeleteBoardUserService)
		private readonly deleteBoardUserService: DeleteBoardUserServiceInterface,
		@Inject(BoardUsers.TYPES.services.UpdateBoardUserService)
		private readonly updateBoardUserService: UpdateBoardUserServiceInterface
	) {}

	async execute({ addBoardUsers, removeBoardUsers, boardUserToUpdateRole }: UpdateBoardUserDto) {
		if (boardUserToUpdateRole) {
			return this.updateBoardParticipantsRole(boardUserToUpdateRole);
		}

		return this.updateBoardParticipants(addBoardUsers, removeBoardUsers);
	}

	/* --------------- HELPERS --------------- */

	private async updateBoardParticipants(addUsers: BoardUserDto[], removeUsers: string[]) {
		try {
			let createdBoardUsers: BoardUser[] = [];

			if (!isEmpty(addUsers))
				createdBoardUsers = await this.createBoardUserService.saveBoardUsers(addUsers);

			if (!isEmpty(removeUsers)) await this.deleteBoardUsers(removeUsers);

			return createdBoardUsers;
		} catch (error) {
			throw new UpdateFailedException();
		}
	}

	private async updateBoardParticipantsRole(boardUserToUpdateRole: BoardUserDto) {
		const user = boardUserToUpdateRole.user as User;

		const updatedBoardUser = await this.updateBoardUserService.updateBoardUserRole(
			boardUserToUpdateRole.board,
			user._id,
			boardUserToUpdateRole.role
		);

		if (!updatedBoardUser) {
			throw new UpdateFailedException();
		}

		return updatedBoardUser;
	}

	private async deleteBoardUsers(boardUsers: string[]) {
		const deletedCount = await this.deleteBoardUserService.deleteBoardUsers(boardUsers);

		if (deletedCount <= 0) throw new UpdateFailedException();
	}
}
