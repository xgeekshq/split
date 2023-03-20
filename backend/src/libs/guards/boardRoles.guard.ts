import { GetTeamUserServiceInterface } from '../../modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	forwardRef
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import TeamUser from 'src/modules/teams/entities/team.user.schema';

@Injectable()
export class BoardUserGuard implements CanActivate {
	constructor(
		@Inject(TeamUsers.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface,
		private readonly reflector: Reflector,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface
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
