import { Inject, Injectable } from '@nestjs/common';

import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetTeamApplication implements GetTeamApplicationInterface {
	constructor(
		@Inject(TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface
	) {}

	countTeams(userId: string) {
		return this.getTeamService.countTeams(userId);
	}

	getAllTeams() {
		return this.getTeamService.getAllTeams();
	}

	getTeamsOfUser(userId: string) {
		return this.getTeamService.getTeamsOfUser(userId);
	}
}
