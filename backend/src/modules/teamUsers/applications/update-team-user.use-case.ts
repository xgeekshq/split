import { UpdateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/update.team.user.service.interface';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { Inject, Injectable } from '@nestjs/common';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UPDATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

@Injectable()
export class UpdateTeamUserUseCase implements UseCase<TeamUserDto, TeamUser> {
	constructor(
		@Inject(UPDATE_TEAM_USER_SERVICE)
		private readonly updateTeamUserService: UpdateTeamUserServiceInterface
	) {}

	execute(teamUserData: TeamUserDto): Promise<TeamUser> {
		return this.updateTeamUserService.updateTeamUser(teamUserData);
	}
}
