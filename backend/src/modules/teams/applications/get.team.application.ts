import { Inject, Injectable } from '@nestjs/common';
import { TeamQueryParams } from '../../../libs/dto/param/team.query.params';
import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import { GET_TEAM_SERVICE } from 'src/modules/teams/constants';

@Injectable()
export class GetTeamApplication implements GetTeamApplicationInterface {
	constructor(
		@Inject(GET_TEAM_SERVICE)
		private getTeamService: GetTeamServiceInterface
	) {}

	getAllTeams() {
		return this.getTeamService.getAllTeams();
	}

	getTeam(teamId: string, teamQueryParams?: TeamQueryParams) {
		return this.getTeamService.getTeam(teamId, teamQueryParams);
	}

	getTeamsOfUser(userId: string) {
		return this.getTeamService.getTeamsOfUser(userId);
	}

	getTeamsUserIsNotMember(userId: string) {
		return this.getTeamService.getTeamsUserIsNotMember(userId);
	}
}
