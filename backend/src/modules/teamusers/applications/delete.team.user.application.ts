import TeamUser from 'src/modules/teams/entities/team.user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import { DeleteTeamUserApplicationInterface } from '../interfaces/applications/delete.team.user.application.interface';

@Injectable()
export class DeleteTeamUserApplication implements DeleteTeamUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}

	deleteTeamUser(teamUserId: string): Promise<TeamUser> {
		return this.deleteTeamUserService.deleteTeamUser(teamUserId, false);
	}
}
