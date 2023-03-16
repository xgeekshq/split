import { GetBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/get.board.user.service.interface';
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
import * as Teams from 'src/modules/teams/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardusers/interfaces/types';
import TeamUser from 'src/modules/teams/entities/team.user.schema';

@Injectable()
export class BoardUserGuard implements CanActivate {
	constructor(
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
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
				teamUser = await this.getTeamService.getTeamUser(user._id, String(board.team));

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
