import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import * as Boards from 'src/modules/boards/interfaces/types';
import User from 'src/modules/users/entities/user.schema';
import UpdateBoardUserDto from 'src/modules/boardUsers/dto/update-board-user.dto';

@Injectable()
export class UpdateBoardPermissionsGuard implements CanActivate {
	constructor(
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const boardId: string = request.params.boardId;
		const userToUpdate: User = (request.body as UpdateBoardUserDto).boardUserToUpdateRole
			.user as User;

		try {
			const board = await this.getBoardService.getBoardOwner(boardId);

			if (!board) {
				throw new NotFoundException();
			}

			return userToUpdate && String(board.createdBy) !== userToUpdate._id;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
