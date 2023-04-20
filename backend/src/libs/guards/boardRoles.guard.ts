import { GetTeamUserServiceInterface } from '../../modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import { GET_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

@Injectable()
export class BoardUserGuard implements CanActivate {
	constructor(
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface,
		private readonly reflector: Reflector,
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface,
		@Inject(GET_BOARD_USER_SERVICE)
		private readonly getBoardUserService: GetBoardUserServiceInterface
	) {}

	async canActivate(context: ExecutionContext) {
		const permissions = this.reflector.get<string>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const boardId: string = request.params.boardId;

		try {
			const board = await this.getBoardService.getBoardById(boardId);

			let teamUser: TeamUser;

			// If board has team, get Team User to check if it is Admin or Stakeholder
			if (board.team)
				teamUser = await this.getTeamUserService.getTeamUser(user._id, String(board.team));

			const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, user._id);

			const hasPermissions =
				user.isSAdmin ||
				permissions.includes(boardUserFound?.role) ||
				permissions.includes(teamUser?.role);

			return hasPermissions;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
