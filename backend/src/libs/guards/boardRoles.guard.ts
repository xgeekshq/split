import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import BoardUser, { BoardUserDocument } from 'src/modules/boards/entities/board.user.schema';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	forwardRef
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Teams from 'src/modules/teams/interfaces/types';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import TeamUser from 'src/modules/teams/entities/team.user.schema';

@Injectable()
export class BoardUserGuard implements CanActivate {
	constructor(
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface,
		private readonly reflector: Reflector,
		@InjectModel(BoardUser.name) private BoardUserModel: Model<BoardUserDocument>,
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>
	) {}

	async canActivate(context: ExecutionContext) {
		const permissions = this.reflector.get<string>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const boardId: string = request.params.boardId;

		try {
			const board = await this.boardModel.findById(boardId).exec();

			let teamUser: TeamUser;

			// If board has team, get Team User to check if it is Admin or Stakeholder
			if (board.team)
				teamUser = await this.getTeamService.getTeamUser(user._id, String(board.team));

			const boardUserFound = await this.BoardUserModel.findOne({
				user: user._id,
				board: boardId
			}).exec();

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
