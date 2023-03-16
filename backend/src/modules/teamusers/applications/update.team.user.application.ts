import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UpdateTeamUserServiceInterface } from '../interfaces/services/update.team.user.service.interface';
import { UpdateTeamUserApplicationInterface } from '../interfaces/applications/update.team.user.application.interface';
import TeamUser from '../entities/team.user.schema';

@Injectable()
export class UpdateTeamUserApplication implements UpdateTeamUserApplicationInterface {
	constructor(
		@Inject(TYPES.services.UpdateTeamUserService)
		private updateTeamUserService: UpdateTeamUserServiceInterface
	) {}

	updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser> {
		return this.updateTeamUserService.updateTeamUser(teamUserData);
	}

	AddAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]> {
		return this.updateTeamUserService.addAndRemoveTeamUsers(addUsers, removeUsers);
	}
}
