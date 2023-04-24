import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

@Injectable()
export class TeamUserGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface
	) {}

	async canActivate(context: ExecutionContext) {
		const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const teamId: string = request.params.teamId;
		try {
			const userFound = await this.getTeamUserService.getTeamUser(user._id, teamId);
			const hasPermissions = permissions.includes(userFound?.role) || user.isSAdmin;

			return hasPermissions;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
