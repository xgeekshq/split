import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@Injectable()
export class UpdateTeamUserUseCase implements UseCase<TeamUserDto, TeamUser> {
	constructor(
		@Inject(TYPES.services.UpdateTeamUserService)
		private readonly updateTeamUserService: UpdateTeamUserServiceInterface
	) {}

	execute(teamUserData: TeamUserDto): Promise<TeamUser> {
		return this.updateTeamUserService.updateTeamUser(teamUserData);
	}
}
