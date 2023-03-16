import { CreateTeamUserServiceInterface } from './../../teamusers/interfaces/services/create.team.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import TeamDto from '../dto/team.dto';
import teamUserDto from '../../teamusers/dto/team.user.dto';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import { TYPES } from '../interfaces/types';
import * as TeamUsers from 'src/modules/teamusers/interfaces/types';

@Injectable()
export class CreateTeamApplication implements CreateTeamApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateTeamService)
		private createTeamService: CreateTeamServiceInterface,
		@Inject(TeamUsers.TYPES.services.CreateTeamUserService)
		private createTeamUserService: CreateTeamUserServiceInterface
	) {}

	createTeamUser(teamUser: teamUserDto) {
		return this.createTeamUserService.createTeamUser(teamUser);
	}

	create(teamData: TeamDto) {
		return this.createTeamService.create(teamData);
	}
}
