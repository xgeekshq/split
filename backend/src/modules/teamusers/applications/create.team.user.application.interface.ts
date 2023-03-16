import TeamUser  from 'src/modules/teams/entities/team.user.schema';
import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import { CreateTeamUserApplicationInterface } from './../interfaces/applications/create.team.user.application.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';

@Injectable()
export class CreateTeamUserApplication implements CreateTeamUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateTeamUserService)
		private createTeamUserService: CreateTeamUserServiceInterface
	) {}

	createTeamUser(teamUser: TeamUserDto): Promise<TeamUser> {
		return this.createTeamUserService.createTeamUser(teamUser);
	}

	createTeamUsers(teamUsers: TeamUserDto[]): Promise<TeamUser[]> {
		return this.createTeamUserService.createTeamUsers(teamUsers);
	}
}
