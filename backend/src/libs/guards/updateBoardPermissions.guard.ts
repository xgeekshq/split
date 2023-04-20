import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import User from 'src/modules/users/entities/user.schema';
import UpdateBoardUserDto from 'src/modules/boardUsers/dto/update-board-user.dto';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export class UpdateBoardPermissionsGuard implements CanActivate {
	constructor(
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const boardId: string = request.params.boardId;
		const userToUpdate: User = (request.body as UpdateBoardUserDto).boardUserToUpdateRole
			?.user as User;
		const hasMembersToAddOrRemove =
			(request.body as UpdateBoardUserDto).addBoardUsers.length > 0 ||
			(request.body as UpdateBoardUserDto).removeBoardUsers.length > 0;

		try {
			const board = await this.getBoardService.getBoardOwner(boardId);

			if (!board) {
				throw new NotFoundException();
			}

			const canUserUpdateRole = userToUpdate
				? String(board.createdBy) !== userToUpdate._id
				: hasMembersToAddOrRemove;

			return canUserUpdateRole;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
