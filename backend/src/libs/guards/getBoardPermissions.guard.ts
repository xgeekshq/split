import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable
} from '@nestjs/common';
import * as Boards from 'src/modules/boards/interfaces/types';
import TeamUser from 'src/modules/teams/entities/team.user.schema';
import Team from 'src/modules/teams/entities/teams.schema';
import User from 'src/modules/users/entities/user.schema';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GetBoardGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	async canActivate(context: ExecutionContext) {
		const permissions = this.reflector.get<string>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const boardId: string = request.params.boardId;

		try {
			const { isPublic, team } = await this.getBoardService.getBoardData(boardId);
			const boardUserFound = await this.getBoardService.getBoardUsers(boardId, user._id);

			if (isPublic || boardUserFound.length) {
				return true;
			}

			if (!boardUserFound) {
				const teamUser = (team as Team).users.find(
					(teamUser: TeamUser) => (teamUser.user as User)._id.toString() === user._id.toString()
				);

				return !user.isAnonymous && (user.isSAdmin || permissions.includes(teamUser.role));
			}
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
