import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import TeamUser, { TeamUserDocument } from '../../modules/teams/schemas/team.user.schema';

@Injectable()
export class TeamUserGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>
	) {}

	async canActivate(context: ExecutionContext) {
		const permission = this.reflector.get<string>('permission', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const team: string = request.params.teamId;

		const userFound = await this.teamUserModel.findOne({ user: user._id, teamId: team }).exec();

		return user.isSAdmin || permission === userFound?.role;
	}
}
