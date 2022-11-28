import { Inject, Injectable } from '@nestjs/common';
import { DeleteTeamApplicationInterface } from '../interfaces/applications/delete.team.application.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteTeamApplication implements DeleteTeamApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteTeamService)
		private deleteTeamServices: DeleteTeamApplicationInterface
	) {}

	delete(teamId: string) {
		return this.deleteTeamServices.delete(teamId);
	}
}
