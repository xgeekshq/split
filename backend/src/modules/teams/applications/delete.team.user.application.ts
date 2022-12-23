import { Inject, Injectable } from '@nestjs/common';
import { DeleteTeamUserApplicationInterface } from '../interfaces/applications/delete.team.user.application.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteTeamUserApplication implements DeleteTeamUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteTeamUserService)
		private deleteTeamUserServices: DeleteTeamUserServiceInterface
	) {}

	deleteTeamOfUser(userId: string, teamId: string, withSession: boolean) {
		return this.deleteTeamUserServices.deleteTeamOfUser(userId, teamId, withSession);
	}
}
