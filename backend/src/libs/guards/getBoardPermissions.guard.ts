import { BoardUserRepository } from './../../modules/boards/repositories/board-user.repository';
import { BoardRepository } from 'src/modules/boards/repositories/board.repository';
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
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private boardRepository: BoardRepository,
		@Inject(Boards.TYPES.repositories.BoardUserRepository)
		private boardUserRepository: BoardUserRepository
	) {}

	async canActivate(context: ExecutionContext) {
		const permissions = this.reflector.get<string>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const { _id: userId, isAnonymous, isSAdmin } = request.user;
		const boardId: string = request.params.boardId;

		try {
			const { isPublic, team } = await this.boardRepository.getBoardData(boardId);
			const boardUserFound = await this.boardUserRepository.getBoardUsers(boardId, userId);

			if (isPublic || boardUserFound.length || isSAdmin) {
				return true;
			}

			if (!boardUserFound.length) {
				const { role: teamRole } = (team as Team).users.find(
					(teamUser: TeamUser) => (teamUser.user as User)._id.toString() === userId.toString()
				);

				return !isAnonymous && permissions.includes(teamRole);
			}
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
