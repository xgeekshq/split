import { GetTeamUserServiceInterface } from './../interfaces/services/get.team.user.service.interface';
import { GetTeamUserApplicationInterface } from 'src/modules/teamusers/interfaces/applications/get.team.user.application.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetTeamUserApplication implements GetTeamUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface
	) {}

	countTeamsOfUser(userId: string): Promise<number> {
		return this.getTeamUserService.countTeamsOfUser(userId);
	}
}
