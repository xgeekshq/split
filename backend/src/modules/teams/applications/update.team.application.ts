import { Inject, Injectable } from '@nestjs/common';
import TeamUserDto from '../dto/team.user.dto';
import { UpdateTeamApplicationInterface } from '../interfaces/applications/update.team.application.interface';
import { UpdateTeamServiceInterface } from '../interfaces/services/update.team.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateTeamApplication implements UpdateTeamApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateTeamService)
		private updateTeamService: UpdateTeamServiceInterface
	) {}

	updateTeamUser(teamData: TeamUserDto) {
		return this.updateTeamService.updateTeamUser(teamData);
	}

	addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]) {
		return this.updateTeamService.addAndRemoveTeamUsers(addUsers, removeUsers);
	}
}
