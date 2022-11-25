import { Inject, Injectable } from '@nestjs/common';
import TeamDto from '../dto/team.dto';
import teamUserDto from '../dto/team.user.dto';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateTeamApplication implements CreateTeamApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateTeamService)
		private createTeamService: CreateTeamServiceInterface
	) {}

	createTeamUser(teamUser: teamUserDto) {
		return this.createTeamService.createTeamUser(teamUser);
	}

	create(teamData: TeamDto) {
		return this.createTeamService.create(teamData);
	}
}
