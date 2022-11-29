import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
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
		const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const teamId: string = request.params.teamId;
		try {
			const userFound = await this.teamUserModel.findOne({ user: user._id, team: teamId }).exec();
			const isTeamAdminOrStakeholder = permissions.includes(userFound?.role);

			return user.isSAdmin || isTeamAdminOrStakeholder;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
