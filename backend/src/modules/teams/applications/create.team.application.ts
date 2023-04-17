import { Inject, Injectable } from '@nestjs/common';
import TeamDto from '../dto/team.dto';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import { CREATE_TEAM_SERVICE } from '../constants';

@Injectable()
export class CreateTeamApplication implements CreateTeamApplicationInterface {
	constructor(
		@Inject(CREATE_TEAM_SERVICE)
		private readonly createTeamService: CreateTeamServiceInterface
	) {}

	create(teamData: TeamDto) {
		return this.createTeamService.create(teamData);
	}
}
